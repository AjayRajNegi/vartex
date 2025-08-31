"use client";

import { toast } from "sonner";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPayment } from "../actions";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Script from "next/script";

export function EnrollmentButton({
  courseId,
  price,
}: {
  courseId: string;
  price: number;
}) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const userId = session?.user.id;

  const [pending, startTransition] = useTransition();
  function onSubmit() {
    startTransition(async () => {
      const handlePayment = async () => {
        try {
          if (!userId) {
            toast.error("You must be logged in to enroll.");
            return;
          }
          const orderResponse = await createPayment({
            amount: price,
            userId: userId,
            courseId: courseId,
          });

          if (orderResponse && "error" in orderResponse) {
            toast.error(orderResponse.error || "Failed to create order.");
            return;
          }

          const { orderId, amount, currency } = orderResponse;

          const options = {
            key: process.env.RAZORPAY_KEY_ID,
            amount: amount! * 100,
            currency: currency,
            name: "Your App Name",
            description: `Subscription for ${courseId}`,
            order_id: orderId,
            handler: async function (response: any) {
              try {
                const verificationResult = await fetch("/api/payment/verify", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    userId: userId,
                    courseId: courseId,
                  }),
                });

                const data = await verificationResult.json();
                if (data.success) {
                  toast.success(
                    data.message || "Subscription activated successfully!"
                  );
                  router.push("/payment/success");
                } else {
                  toast.error(
                    data.error ||
                      "Payment verification failed. Please contact support."
                  );
                }
              } catch (fetchError) {
                console.error("Error during verification fetch:", fetchError);
                toast.error(
                  "An error occurred during payment verification. Please contact support."
                );
              }
            },
            prefill: {
              name: session?.user.name || "",
              email: session?.user.email || "",
            },
            theme: {
              color: "#ce8949ff",
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.on("payment.failed", function (response: any) {
            toast.error(
              `Payment Failed: ${
                response.error.description || "Unknown error"
              }. Please try again.`
            );
            console.error("Razorpay Payment Failed:", response.error);
          });
          rzp.open();
        } catch (error) {
          console.error("Error initiating payment:", error);
          toast.error("Failed to initiate payment. Please try again.");
        }
      };
      await handlePayment();
    });
  }
  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <Button disabled={pending} onClick={onSubmit} className="w-full">
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin"></Loader2>
          </>
        ) : (
          "Enroll Now"
        )}
      </Button>
    </>
  );
}

// const { data: result, error } = await tryCatch(
//   enrollInCourseAction(courseId)
// );
// if (error) {
//   toast.error("An unexpected error occured.");
//   return;
// }
// if (result.status === "success") {
//   toast.success(result.message);
// } else if (result.status === "error") {
//   toast.error(result.message);
// }
