"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
