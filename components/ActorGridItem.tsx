import HeartIcon from "mdi-react/HeartIcon";
import Link from "next/link";

import { thumbnailUrl } from "../util/thumbnail";
import ResponsiveImage from "./ResponsiveImage";

type Props = {
  name: string;
  thumbnailId?: string;
  favorite?: boolean;
  id: string;
};

export default function ActorCard({ id, name, thumbnailId, favorite }: Props) {
  return (
    <Link href={`/actor/${id}`} passHref>
      <a style={{ display: "block" }} className="hover">
        <div className="hover" style={{ position: "relative" }}>
          <ResponsiveImage
            aspectRatio="3 / 4"
            href={`/actor/${id}`}
            src={thumbnailId && thumbnailUrl(thumbnailId)}
          />
          {favorite && (
            <div
              style={{
                position: "absolute",
                right: 4,
                top: 4,
              }}
            >
              <HeartIcon color="error" />
            </div>
          )}
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "white",
              background: "#000000bb",
              textAlign: "center",
              position: "absolute",
              bottom: 10,
              left: 0,
              right: 0,
              margin: "0 5px",
              borderRadius: 8,
              padding: "4px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {name}
          </div>
        </div>
      </a>
    </Link>
  );
}
