import { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export default function StatCard({ title, children }: Props) {
  return (
    <div
      style={{
        borderRadius: 10,
        textAlign: "center",
        padding: 10,
        border: "1px solid #90909050",
        textTransform: "capitalize",
      }}
    >
      <div style={{ fontSize: 32, fontWeight: 500, marginBottom: 5 }}>{children}</div>
      <div>{title}</div>
    </div>
  );
}
