import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ShieldX } from "lucide-react";
import Link from "next/link";

export default function NotAdminPage() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="max-w-sm w-full">
        <CardHeader className="text-center">
          <div className="bg-destructive/1Ø rounded-full p-4 w—fit mx-auto">
            <ShieldX className="size-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Restricted</CardTitle>
          <CardDescription className="max-w-xs mx-auto">
            Hey! You are not an admin, which means you can&apos;t create any
            courses or stuff like that...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/" className={buttonVariants({ className: "w-full" })}>
            <ArrowLeft className="mr-1 size-4" />
            Back To Home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
