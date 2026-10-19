import { ReactNode } from "react";

export const ContentContainer = ({ children }: { children: ReactNode }) => (
  <div className="content-container">{children}</div>
);
