import { MdiReactIconComponentType } from "mdi-react";

type Props = {
  value: boolean;
  onClick: () => void;
  activeIcon: MdiReactIconComponentType;
  inactiveIcon: MdiReactIconComponentType;
};

const size = 24;

export default function IconButtonFilter({ value, activeIcon, inactiveIcon, onClick }: Props) {
  const ActiveIcon = activeIcon;
  const InactiveIcon = inactiveIcon;

  return (
    <div onClick={onClick} className="hover" style={{ display: "flex", alignItems: "center" }}>
      {value ? <ActiveIcon size={size} /> : <InactiveIcon size={size} />}
    </div>
  );
}
