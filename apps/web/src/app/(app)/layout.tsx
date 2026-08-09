import type { ReactNode } from "react";
import { AppShell } from "../app-shell/app-shell";

export default function ApplicationLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <AppShell>{children}</AppShell>;
}
