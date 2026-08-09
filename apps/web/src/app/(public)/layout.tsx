import type { ReactNode } from "react";
import { PublicShell } from "../public-shell/public-shell";
export default function PublicLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <PublicShell>{children}</PublicShell>;
}
