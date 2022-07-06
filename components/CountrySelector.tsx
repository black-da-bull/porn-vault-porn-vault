import { useContext, useMemo } from "react";

import { ThemeContext } from "../pages/_app";
import defaultCountries from "../src/data/countries";
import Flag from "./Flag";
import Paper from "./Paper";

type Props = {
  value: string;
  onChange: (s: string) => void;
  relevancy?: number;
  style?: React.CSSProperties;
};

export function CountrySelector({ style, value, onChange, relevancy: minRelevancy }: Props) {
  const { theme } = useContext(ThemeContext);

  const countries = useMemo(() => {
    return defaultCountries.filter(({ relevancy }) => relevancy > (minRelevancy ?? 1));
  }, [minRelevancy]);

  function isSelected(countryCode: string): boolean {
    return value === countryCode;
  }

  return (
    <>
      {countries.map((country) => (
        <Paper
          onClick={() => {
            if (isSelected(country.alpha2)) {
              onChange?.("");
            } else {
              onChange?.(country.alpha2);
            }
          }}
          className="hover"
          key={country.alpha2}
          style={{
            border: "none",
            padding: "5px 12px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: isSelected(country.alpha2)
              ? theme === "dark"
                ? "#303350"
                : "#ccddff"
              : theme === "dark"
              ? "#1C1C25"
              : "white",
          }}
        >
          <Flag name={country.alias || country.name} code={country.alpha2} size={24} />
          <div style={{ opacity: 0.8, fontSize: 16, fontWeight: 500 }}>
            {country.alias || country.name}
          </div>
        </Paper>
      ))}
    </>
  );
}
