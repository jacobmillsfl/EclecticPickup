import { ReactNode } from "react";

type ShadowBoxMode = "top" | "mid" | "bot" | "form" | "wide";

export default function ShadowBox({
  children,
  mode,
}: {
  children: ReactNode;
  mode: ShadowBoxMode;
}) {
  return (
    <div className={`content-panel content-panel--${mode}`}>{children}</div>
  );
}
