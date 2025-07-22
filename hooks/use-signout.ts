"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function useSignout() {
  const router = useRouter();
  const handleSignOut = async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          toast.success("Signed out SUccessfully!!");
        },
        onError: () => {
          toast.error("Error while signing out.");
        },
      },
    });
  };

  return handleSignOut;
}
