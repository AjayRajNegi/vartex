import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center">
      <Link
        href="/"
        className={buttonVariants({
          variant: "outline",
          className: "absolute top-4 left-4",
        })}
      >
        <ArrowLeft className="size—4" />
        Back
      </Link>

      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          className="flex items-center gap-2 self-center font-medium"
          href="/"
        >
          <Image src="/logo.png" alt="logo" height={32} width={32} /> VarTex
        </Link>
        {children}

        <div className="text-center text—xs text-muted-foreground px-14">
          By clicking continue, you agree to our{" "}
          <span className="hover:text—primary hover:underline">
            Terms of service
          </span>{" "}
          and{" "}
          <span className="hover:text—primary hover:underline">
            Privacy Policy
          </span>
          .
        </div>
      </div>
    </div>
  );
}
