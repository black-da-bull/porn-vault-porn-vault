import Axios from "axios";
import StatsIcon from "mdi-react/ChartBarStackedIcon";
import { useTranslations } from "next-intl";
import useSWR from "swr";

import WidgetCard from "./WidgetCard";

async function getInfo() {
  const res = await Axios.post("/api/ql", {
    query: `
    {
      numScenes
      numActors
      numMovies
      numImages
      numStudios
    }
    `,
  });
  return {
    numScenes: res.data.data.numScenes as number,
    numActors: res.data.data.numActors as number,
    numMovies: res.data.data.numMovies as number,
    numImages: res.data.data.numImages as number,
    numStudios: res.data.data.numStudios as number,
  };
}

export default function StatsCard() {
  const t = useTranslations();

  const { data: stats } = useSWR("stats", getInfo, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateOnMount: true,
    refreshInterval: 60000,
  });

  return (
    <WidgetCard icon={<StatsIcon />} title={t("stats")}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <span style={{ fontSize: 32, fontWeight: 400 }}>{stats?.numScenes || 0}</span>{" "}
          <span style={{ opacity: 0.8 }}>{t("scene", { numItems: stats?.numScenes || 0 })}</span>
        </div>
        <div>
          <span style={{ fontSize: 32, fontWeight: 400 }}>{stats?.numActors || 0}</span>{" "}
          <span style={{ opacity: 0.8 }}> {t("actor", { numItems: stats?.numActors || 0 })}</span>
        </div>
        <div>
          <span style={{ fontSize: 32, fontWeight: 400 }}>{stats?.numMovies || 0}</span>{" "}
          <span style={{ opacity: 0.8 }}> {t("movie", { numItems: stats?.numMovies || 0 })}</span>
        </div>
        <div>
          <span style={{ fontSize: 32, fontWeight: 400 }}>{stats?.numStudios || 0}</span>{" "}
          <span style={{ opacity: 0.8 }}> {t("studio", { numItems: stats?.numStudios || 0 })}</span>
        </div>
        <div>
          <span style={{ fontSize: 32, fontWeight: 400 }}>{stats?.numImages || 0}</span>{" "}
          <span style={{ opacity: 0.8 }}> {t("image", { numItems: stats?.numImages || 0 })}</span>
        </div>
      </div>
    </WidgetCard>
  );
}
