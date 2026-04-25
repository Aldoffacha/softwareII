"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import { UserProfile } from "@/types";

export function useRequireAuth() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/");
      return;
    }

    apiGet<UserProfile>("/api/auth/me")
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("token");
        router.replace("/");
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  return { user, isLoading };
}
