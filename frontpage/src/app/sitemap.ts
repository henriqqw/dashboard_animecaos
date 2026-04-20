import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const LOCALES = ["pt", "en"] as const;
const ROUTES = ["", "/about", "/download", "/how-to-use", "/contact"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return LOCALES.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: `${SITE_URL}/${locale}${route}`,
      lastModified,
      changeFrequency: (route === "" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: route === "" ? 1.0 : 0.8,
    }))
  );
}
