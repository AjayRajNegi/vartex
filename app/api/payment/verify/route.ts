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
  } catch (error: unknown) {
    console.error("[PAYMENT_VERIFY] Error:", error);

    let errorMessage = "Internal server error";
    if (error && typeof error === "object" && "message" in error) {
      errorMessage =
        String((error as { message?: string }).message) || errorMessage;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
