import SceneCard from "../SceneCard";
import Pagination from "../Pagination";
import CardTitle from "../CardTitle";
import Button from "../Button";

import HeartIcon from "mdi-react/HeartIcon";
import HeartBorderIcon from "mdi-react/HeartOutlineIcon";
import BookmarkIcon from "mdi-react/BookmarkIcon";
import BookmarkBorderIcon from "mdi-react/BookmarkOutlineIcon";
import Rating from "../Rating";
import ListWrapper from "../ListWrapper";

import ActorSelector from "../ActorSelector";
import { useSceneList } from "../../composables/use_scene_list";
import { useEffect, useState } from "react";
import useUpdateEffect from "../../composables/use_update_effect";

import Star from "mdi-react/StarIcon";
import StarHalf from "mdi-react/StarHalfFullIcon";
import StarOutline from "mdi-react/StarBorderIcon";
import ActorIcon from "mdi-react/AccountIcon";
import ActorOutlineIcon from "mdi-react/AccountOutlineIcon";

import LabelIcon from "mdi-react/LabelIcon";
import LabelOutlineIcon from "mdi-react/LabelOutlineIcon";

import { useCollabs } from "../../composables/use_collabs";
import { useTranslations } from "next-intl";
import useLabelList from "../../composables/use_label_list";
import LabelSelector from "../LabelSelector";
import IconButtonFilter from "../IconButtonFilter";
import IconButtonMenu from "../IconButtonMenu";

type QueryState = {
  q: string;
  favorite: boolean;
  bookmark: boolean;
  rating: number;
  actors: string[];
  labels: string[];
  page: number;
};

type Props = {
  actorId: string;
  initialState: QueryState;
  writeQuery: (qs: QueryState) => void;
};

export default function ActorDetailsPageSceneList(props: Props) {
  const t = useTranslations();

  const { collabs, loading: collabsLoader } = useCollabs(props.actorId);
  const { labels: labelList, loading: labelLoader } = useLabelList();

  const [query, setQuery] = useState(props.initialState.q);
  const [favorite, setFavorite] = useState(props.initialState.favorite);
  const [bookmark, setBookmark] = useState(props.initialState.bookmark);
  const [rating, setRating] = useState(props.initialState.rating);

  const [selectedActors, setSelectedActors] = useState(props.initialState.actors);
  const [actorQuery, setActorQuery] = useState("");

  const [selectedLabels, setSelectedLabels] = useState(props.initialState.labels);
  const [labelQuery, setLabelQuery] = useState("");

  const [page, setPage] = useState(props.initialState.page);
  const {
    scenes,
    fetchScenes,
    numItems: numScenes,
    numPages: numScenePages,
    loading: sceneLoader,
  } = useSceneList(
    {
      items: [],
      numItems: 0,
      numPages: 0,
    },
    {
      actors: [props.actorId, ...selectedActors],
      include: selectedLabels,
      query,
      favorite,
      bookmark,
      rating,
    }
  );

  async function refreshScenes(): Promise<void> {
    fetchScenes(page);
    props.writeQuery({
      q: query,
      page,
      favorite,
      bookmark,
      rating,
      labels: selectedLabels,
      actors: selectedActors,
    });
  }

  async function onPageChange(x: number): Promise<void> {
    setPage(x);
    fetchScenes(x);
  }

  useUpdateEffect(() => {
    setPage(0);
  }, [
    query,
    favorite,
    bookmark,
    rating,
    JSON.stringify(selectedActors),
    JSON.stringify(selectedLabels),
  ]);

  useEffect(() => {
    refreshScenes();
  }, [page]);

  const hasNoCollabs = !collabsLoader && !collabs.length;
  const hasNoLabels = !labelLoader && !labelList.length;

  return (
    <div style={{ padding: 10 }}>
      <CardTitle style={{ marginBottom: 20 }}>
        {sceneLoader ? (
          "Loading..."
        ) : (
          <span>
            {numScenes} {t("scene", { numItems: numScenes })}
          </span>
        )}
      </CardTitle>
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 10,
        }}
      >
        <input
          style={{ maxWidth: 120 }}
          onKeyDown={(ev) => {
            if (ev.key === "Enter") {
              refreshScenes();
            }
          }}
          placeholder={t("findContent")}
          value={query}
          onChange={(ev) => setQuery(ev.target.value)}
        />
        <IconButtonFilter
          value={favorite}
          onClick={() => setFavorite(!favorite)}
          activeIcon={HeartIcon}
          inactiveIcon={HeartBorderIcon}
        />
        <IconButtonFilter
          value={bookmark}
          onClick={() => setBookmark(!bookmark)}
          activeIcon={BookmarkIcon}
          inactiveIcon={BookmarkBorderIcon}
        />
        <IconButtonMenu
          value={!!rating}
          activeIcon={rating === 10 ? Star : StarHalf}
          inactiveIcon={StarOutline}
        >
          <Rating value={rating} onChange={setRating} />
        </IconButtonMenu>
        <IconButtonMenu
          counter={selectedLabels.length}
          value={!!selectedLabels.length}
          activeIcon={LabelIcon}
          inactiveIcon={LabelOutlineIcon}
          isLoading={labelLoader}
          disabled={hasNoLabels}
        >
          <input
            style={{ width: "100%", marginBottom: 10 }}
            placeholder={t("findLabels")}
            value={labelQuery}
            onChange={(ev) => setLabelQuery(ev.target.value)}
          />
          <LabelSelector
            selected={selectedLabels}
            items={labelList.filter(
              (label) =>
                label.name.toLowerCase().includes(labelQuery.toLowerCase()) ||
                label.aliases.some((alias) =>
                  alias.toLowerCase().includes(labelQuery.toLowerCase())
                )
            )}
            onChange={setSelectedLabels}
          />
        </IconButtonMenu>
        <IconButtonMenu
          counter={selectedActors.length}
          value={!!selectedActors.length}
          activeIcon={ActorIcon}
          inactiveIcon={ActorOutlineIcon}
          isLoading={collabsLoader}
          disabled={hasNoCollabs}
        >
          <input
            style={{ width: "100%", marginBottom: 10 }}
            placeholder={t("findActors")}
            value={actorQuery}
            onChange={(ev) => setActorQuery(ev.target.value)}
          />
          <ActorSelector
            selected={selectedActors}
            items={collabs.filter(
              (collab) =>
                collab.name.toLowerCase().includes(actorQuery.toLowerCase()) ||
                collab.aliases.some((alias) =>
                  alias.toLowerCase().includes(actorQuery.toLowerCase())
                )
            )}
            onChange={setSelectedActors}
          />
        </IconButtonMenu>
        <div style={{ flexGrow: 1 }}></div>
        <Button loading={sceneLoader} onClick={refreshScenes}>
          {t("refresh")}
        </Button>
      </div>
      <ListWrapper loading={sceneLoader} noResults={!numScenes}>
        {scenes.map((scene) => (
          <SceneCard key={scene._id} scene={scene} />
        ))}
      </ListWrapper>
      <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
        <Pagination numPages={numScenePages} current={page} onChange={onPageChange} />
      </div>
    </div>
  );
}
