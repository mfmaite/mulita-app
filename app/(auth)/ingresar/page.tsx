import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/auth-screen";

export const metadata: Metadata = { title: "Ingresar" };

export default function SignInPage() {
  return <AuthScreen mode="sign-in" />;
}
