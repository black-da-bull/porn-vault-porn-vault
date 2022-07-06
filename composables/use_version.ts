import Axios from "axios";
import { useEffect,useState } from "react";

export function useVersion() {
  const [version, setVersion] = useState("");
  useEffect(() => {
    Axios.get("/api/version").then((res) => {
      setVersion(res.data.result);
    });
  }, []);
  return { version };
}
