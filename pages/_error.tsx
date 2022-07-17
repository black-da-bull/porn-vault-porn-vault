import Axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import HeartIcon from "mdi-react/HeartIcon";
import HeartBorderIcon from "mdi-react/HeartOutlineIcon";
import BookmarkIcon from "mdi-react/BookmarkIcon";
import BookmarkBorderIcon from "mdi-react/BookmarkOutlineIcon";

import { IImage } from "../types/image";
import Button from "../components/Button";

async function getRandomImage() {
  const res = await Axios.post(
    "/api/ql",
    {
      query: `
        query($query: ImageSearchQuery!, $seed: String) {
          getImages(query: $query, seed: $seed) {
            items {
              _id
              favorite
              actors {
                name
              }
              scene {
                _id
                name
              }
            }
          }
        }
      `,
      variables: {
        query: {
          query: "",
          skip: 0,
          take: 1,
          sortBy: "$shuffle",
        },
        seed: Date.now().toString(),
      },
    },
    {
      headers: {
        "x-pass": "xxx",
      },
    }
  );
  return res.data.data.getImages.items[0];
}

export default function ErrorPage() {
  const [img, setImg] = useState<
    | (IImage & {
        actors: { name: string }[];
        scene: { _id: string; name: string };
      })
    | null
  >(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    getRandomImage().then(setImg);
  }, [count]);

  return (
    <div style={{ padding: 10, textAlign: "center" }}>
      <h2>Error</h2>
      {img && (
        <>
          <div style={{ justifyContent: "center", display: "flex", gap: 10, marginBottom: 10 }}>
            {/* <div className="hover">
              {img.favorite ? (
                <HeartIcon style={{ fontSize: 28, color: "#ff3355" }} />
              ) : (
                <HeartBorderIcon style={{ fontSize: 28 }} />
              )}
            </div>
            <div className="hover">
              {img.bookmark ? (
                <BookmarkIcon style={{ fontSize: 28 }} />
              ) : (
                <BookmarkBorderIcon style={{ fontSize: 28 }} />
              )}
            </div> */}
          </div>
          <div className="flex content-center">
            <div style={{ position: "relative" }}>
              <img
                style={{ borderRadius: 10, maxHeight: "50vh" }}
                src={`/api/media/image/${img._id}`}
              />
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <h4 style={{ marginBottom: 8 }}>
              <Link href={`/scene/${img.scene._id}`}>{img.scene.name}</Link>
            </h4>
            <div style={{ fontSize: 16, fontStyle: "italic", marginBottom: 16 }}>
              starring {img.actors.map((a) => a.name).join(", ") || "???"}
            </div>
            <Button onClick={() => setCount(count + 1)}>Shuffle</Button>
          </div>
        </>
      )}
      {count > 10 && (
        <div style={{ textAlign: "center", marginTop: 10, opacity: 0.8 }}>
          <i>Stop shuffling and get back to the real content!</i>
        </div>
      )}
    </div>
  );
}
