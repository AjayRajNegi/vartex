"use server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { prisma } from "@/lib/db";
// import { Resend } from "resend";

interface PaymentData {
  amount: number;
  userId: string;
  courseId: string;
}

interface PaymentResult {
  success?: boolean;
  orderId?: string;
  amount?: number;
  currency?: string;
  paymentId?: string;
  error?: string;
}

interface VerificationResult {
  success?: boolean;
  error?: string;
}
// const resend: Resend = new Resend(process.env.RESEND_API_KEY as string);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createPayment(
  paymentData: PaymentData
): Promise<PaymentResult> {
  try {
    const { amount, courseId, userId } = paymentData;
    const amountInPaisa = Math.round(amount * 100);
    const currency = "INR";

    if (!amountInPaisa || amountInPaisa <= 0) {
      return { error: "Invalid payment amount." };
    }

    const options = {
      amount: amountInPaisa,
      currency: currency,
      receipt: `rcpt_${Date.now().toString().slice(-8)}_${userId.slice(-6)}`,
      payment_capture: 1,
      notes: {
        description: `Subscription payment for course.`.toString(),
        courseId: courseId.toString(),
        userId: userId.toString(),
        originalAmount: amount.toString(),
      },
    };

    try {
      const order = await razorpay.orders.create(options);
      if (!order?.id) {
        console.error(
          "[RAZORPAY_ORDER_CREATE] Order ID not returned by Razorpay."
        );
        return {
          error: "Failed to create payment order from Razorpay.",
        };
      }

      const payment = await prisma.payment.create({
        data: {
          userId: userId,
          courseId: courseId,
          amount: amount,
          currency: currency,
          receiptId: options.receipt,
          status: "PENDING",
          razorpayOrderId: order.id,
          description: `Subscription payment for ${courseId}`,
        },
      });

      const result: PaymentResult = {
        success: true,
        orderId: order.id,
        amount: amount,
        currency: currency,
        paymentId: payment.id,
      };

      return result;
    } catch (error: unknown) {
      console.error(
        "[RAZORPAY_ORDER_CREATE] Error creating Razorpay order:",
        error
      );

      let errorMessage = "Failed to create payment order. Please try again.";
      if (error && typeof error === "object" && "message" in error) {
        errorMessage =
          String((error as { message?: string }).message) || errorMessage;
      }
      if (error && typeof error === "object" && "error" in error) {
        errorMessage =
          (error as { error?: { description?: string } }).error?.description ||
          errorMessage;
      }

      return { error: errorMessage };
    }
  } catch (error) {
    console.error("[PAYMENT_CREATE] General error:", error);
    return { error: "Something went wrong while initiating payment." };
  }
}

export async function verifyPayment(
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
  userId: string,
  courseId: string
): Promise<VerificationResult> {
  try {
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return { error: "Missing payment verfication details!" };
    }
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("[PAYMENT_VERIFY] Invalid Signature.");
      await prisma.payment.updateMany({
        where: { razorpayOrderId: razorpay_order_id, userId: userId },
        data: {
          status: "FAILED",
          razorpayPaymentId: razorpay_payment_id,
          description: "Invalid signature",
        },
      });
      return { error: "Invalid payment signature." };
    }

    const payment = await prisma.payment.findFirst({
      where: { razorpayOrderId: razorpay_order_id, userId: userId },
    });

    if (!payment) {
      console.error("[PAYMENT_VERIFY] Payment record not found in DB.");
      return { error: "Payment record not found." };
    }

    const razorpayPaymentDetails = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    const existingByPaymentId = await prisma.payment.findFirst({
      where: { razorpayOrderId: razorpay_order_id },
    });
    if (existingByPaymentId && existingByPaymentId.id !== payment.id) {
      await prisma.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          status: "FAILED",
          description: "Duplicate razorpayPaymentId detected",
        },
      });
      return { error: "This payment has already been processed." };
    }

    if (razorpayPaymentDetails.status !== "captured") {
      console.error(
        `[PAYMENT_VERIFY] Razorpay payment status not captured: ${razorpayPaymentDetails.status}`
      );
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: razorpayPaymentDetails.status.toUpperCase(),
          razorpayPaymentId: razorpay_payment_id,
          description: `Razorpay status: ${razorpayPaymentDetails.status}`,
        },
      });
      return {
        error: `Payment not captured by Razorpay. Current status: ${razorpayPaymentDetails.status}.`,
      };
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "SUCCESS",
        razorpayPaymentId: razorpay_payment_id,
        method: razorpayPaymentDetails.method || "unknown",
        courseId: courseId,
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.email) {
      // await resend.emails.send({
      //   from: "VarTex <noreply@redsan.in>",
      //   to: user.email,
      //   subject: "Course payment successfull.",
      //   html: `<p>Thank you for buying our course: ${course?.title}</p>`,
      // });
      console.log("Payment Successfull.");
    }
    return { success: true };
  } catch (error: unknown) {
    console.error("[PAYMENT_VERIFY] Error:", error);
    let errorMessage = "Something went wrong during payment verification.";
    if (error && typeof error === "object" && "message" in error) {
      errorMessage =
        String((error as { message?: string }).message) || errorMessage;
    }
    return { error: errorMessage };
  }
}
