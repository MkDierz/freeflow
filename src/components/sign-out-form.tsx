"use client";
import { signOut } from "next-auth/react";

export function SignOutForm() {
  return <button onClick={() => signOut()}>Sign Out</button>;
}
