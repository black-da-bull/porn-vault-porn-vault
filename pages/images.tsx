import { useTranslations } from "next-intl";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { fetchImages, useImageList } from "../composables/use_image_list";
import { imageUrl, thumbnailUrl } from "../util/thumbnail";
import { GetServerSideProps } from "next";
import { IImage } from "../types/image";
import { IPaginationResult } from "../types/pagination";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import { Masonry } from "masonic";

import HeartIcon from "mdi-react/HeartIcon";
import HeartBorderIcon from "mdi-react/HeartOutlineIcon";
import BookmarkIcon from "mdi-react/BookmarkIcon";
import BookmarkBorderIcon from "mdi-react/BookmarkOutlineIcon";
import Button from "../components/Button";
import useUpdateEffect from "../composables/use_update_effect";
import ImageCard from "../components/ImageCard";
import SortDirectionButton, { SortDirection } from "../components/SortDirectionButton";
import IconButtonFilter from "../components/IconButtonFilter";
import { buildQueryParser } from "../util/query_parser";
import IconButtonMenu from "../components/IconButtonMenu";
import Rating from "../components/Rating";

import Star from "mdi-react/StarIcon";
import StarHalf from "mdi-react/StarHalfFullIcon";
import StarOutline from "mdi-react/StarBorderIcon";
import useLabelList from "../composables/use_label_list";

import LabelIcon from "mdi-react/LabelIcon";
import LabelOutlineIcon from "mdi-react/LabelOutlineIcon";
import LabelSelector from "../components/LabelSelector";

const queryParser = buildQueryParser({
  q: {
    default: "",
  },
  page: {
    default: 0,
  },
  sortBy: {
    default: "addedOn",
  },
  sortDir: {
    default: "desc" as SortDirection,
  },
  favorite: {
    default: false,
  },
  bookmark: {
    default: false,
  },
  rating: {
    default: 0,
  },
  labels: {
    default: [] as string[],
  },
});

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { page, q, sortBy, sortDir, favorite, bookmark, labels } = queryParser.parse(query);

  const result = await fetchImages(page, {
    query: q,
    sortBy,
    sortDir,
    favorite,
    bookmark,
    include: labels,
  });

  return {
    props: {
      page,
      initial: result,
    },
  };
};

export default function ImageListPage(props: { page: number; initial: IPaginationResult<IImage> }) {
  const router = useRouter();
  const t = useTranslations();

  const [activeIndex, setActive] = useState<number>(-1);

  const parsedQuery = useMemo(() => queryParser.parse(router.query), []);

  const [query, setQuery] = useState(parsedQuery.q);
  const [favorite, setFavorite] = useState(parsedQuery.favorite);
  const [bookmark, setBookmark] = useState(parsedQuery.bookmark);
  const [rating, setRating] = useState(parsedQuery.rating);
  const [sortBy, setSortBy] = useState(parsedQuery.sortBy);
  const [sortDir, setSortDir] = useState(parsedQuery.sortDir);
  const [page, setPage] = useState(props.page);

  const { labels: labelList, loading: labelLoader } = useLabelList();
  const [selectedLabels, setSelectedLabels] = useState(parsedQuery.labels);
  const [labelQuery, setLabelQuery] = useState("");

  const { images, fetchImages, loading, numItems, numPages } = useImageList(props.initial, {
    rating,
    query,
    favorite,
    bookmark,
    sortBy,
    sortDir,
    include: selectedLabels,
  });

  async function onPageChange(x: number): Promise<void> {
    setPage(x);
  }

  async function refresh(): Promise<void> {
    fetchImages(page);
    queryParser.store(router, {
      q: query,
      favorite,
      bookmark,
      sortBy,
      sortDir,
      page,
      rating,
      labels: selectedLabels,
    });
  }

  useUpdateEffect(() => {
    setPage(0);
  }, [query, favorite, bookmark, sortBy, sortDir, JSON.stringify(selectedLabels)]);

  useUpdateEffect(refresh, [page]);

  const hasNoLabels = !labelLoader && !labelList.length;

  function renderContent() {
    if (loading) {
      return (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Loader />
        </div>
      );
    }

    if (!images.length) {
      return (
        <div style={{ display: "flex", justifyContent: "center" }}>
          {t("foundImages", { numItems })}
        </div>
      );
    }

    return (
      <Masonry
        items={images}
        rowGutter={1}
        columnGutter={4}
        render={({ data, index }) => (
          <ImageCard
            // TODO: use a "hasPrevious" prop instead
            onPrevious={index > 0 ? () => setActive(index - 1) : undefined}
            onNext={index < images.length - 1 ? () => setActive(index + 1) : undefined}
            onOpen={() => setActive(index)}
            onClose={() => setActive(-1)}
            active={index === activeIndex}
            favorite={data.favorite}
            bookmark={data.bookmark}
            rating={data.rating}
            key={data._id}
            fullSrc={imageUrl(data._id)}
            src={thumbnailUrl(data._id)}
            alt={data.name}
          />
        )}
      />
    );
  }

  return (
    <div style={{ padding: 10 }}>
      <Head>
        <title>{t("foundImages", { numItems })}</title>
      </Head>
      <div style={{ marginBottom: 20, display: "flex", alignItems: "center" }}>
        <div style={{ fontSize: 20, fontWeight: "bold" }}>{t("foundImages", { numItems })}</div>
        <div style={{ flexGrow: 1 }}></div>
        <Pagination numPages={numPages} current={page} onChange={(page) => onPageChange(page)} />
      </div>
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
          onKeyDown={(ev) => {
            if (ev.key === "Enter") {
              refresh();
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
        <select value={sortBy} onChange={(ev) => setSortBy(ev.target.value)}>
          <option value="relevance">{t("relevance")}</option>
          <option value="addedOn">{t("addedToCollection")}</option>
          <option value="rating">{t("rating")}</option>
        </select>
        <SortDirectionButton
          disabled={sortBy === "$shuffle"}
          value={sortDir}
          onChange={setSortDir}
        />
        <div style={{ flexGrow: 1 }}></div>
        <Button onClick={refresh}>{t("refresh")}</Button>
      </div>
      {renderContent()}
      <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
        <Pagination numPages={numPages} current={page} onChange={onPageChange} />
      </div>
    </div>
  );
}
