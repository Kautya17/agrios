import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const investor = await prisma.user.upsert({
      where: { email: body.email },
      update: {},
      create: { email: body.email, name: body.name, role: "INVESTOR" },
    });

    const interest = await prisma.investorInterest.create({
      data: {
        listingId: id,
        investorId: investor.id,
        budget: body.budget ? parseFloat(body.budget) : null,
        message: body.message || null,
      },
    });

    return NextResponse.json({ success: true, interest });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to submit interest" }, { status: 500 });
  }
}