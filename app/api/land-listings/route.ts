import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const user = await prisma.user.upsert({
      where: { email: body.email },
      update: {},
      create: {
        email: body.email,
        name: body.name,
        role: "OWNER",
      },
    });

    const listing = await prisma.landListing.create({
      data: {
        ownerId: user.id,
        location: body.location,
        areaAcres: parseFloat(body.areaAcres),
        waterSource: body.waterSource || null,
        currentCrop: body.currentCrop || null,
      },
    });

    return NextResponse.json({ success: true, listing });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to save listing" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");

  const listings = await prisma.landListing.findMany({
    where: status ? { status: status as any } : undefined,
    include: { owner: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ listings });
}