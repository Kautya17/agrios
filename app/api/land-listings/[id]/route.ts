import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    if (body.status === "APPROVED" && body.notes) {
      const reviewer = await prisma.user.upsert({
        where: { email: "admin@agrios.local" },
        update: {},
        create: { email: "admin@agrios.local", name: "Admin Reviewer", role: "ENGINEER" },
      });

      await prisma.inspectionReport.create({
        data: { listingId: id, engineerId: reviewer.id, cropSuitability: body.notes },
      });
    }

    const listing = await prisma.landListing.update({
      where: { id },
      data: { status: body.status },
    });

    return NextResponse.json({ success: true, listing });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to update listing" }, { status: 500 });
  }
}