import ReactCrop, { Crop, PixelCrop } from "react-image-crop";

type Props = {
  src: string;
  value: Crop;
  onChange: (crop: PixelCrop) => void;
  aspectRatio?: number;
  circular?: boolean;
};

export function Cropper({ circular, value, onChange, src, aspectRatio }: Props) {
  return (
    <div>
      <ReactCrop circularCrop={circular} crop={value} onChange={onChange} aspect={aspectRatio}>
        <img src={src} />
      </ReactCrop>
    </div>
  );
}

export function AvatarCropper({ value, onChange, src }: Omit<Props, "aspectRatio">) {
  return <Cropper src={src} circular value={value} onChange={onChange} aspectRatio={1} />;
}
