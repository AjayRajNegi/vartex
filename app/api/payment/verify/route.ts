import { NextResponse } from "next/server";
import { verifyPayment } from "@/app/(public)/courses/[slug]/actions";

export async function POST(req: Request) {
  console.log("HElasd");
  try {
    const body = await req.json();
    console.log("body", body);
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      courseId,
    } = body;

    if (
      !razorpay_payment_id ||
      !razorpay_signature ||
      !razorpay_order_id ||
      !userId ||
      !courseId
    ) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const result = await verifyPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      courseId
    );

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[PAYMENT_VERIFY] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
