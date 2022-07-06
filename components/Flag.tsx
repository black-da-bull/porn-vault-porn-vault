type Props = {
  name: string;
  code: string;
  size?: number;
};

const ratio = 3 / 4;

export default function Flag({ name, code, size }: Props) {
  const w = size || 32;
  const h = w * ratio;
  return <img title={name} width={w} height={h} src={`/assets/flags/${code.toLowerCase()}.svg`} />;
}
