import type { NextConfig } from "next";

// Önizleme sitesi: arama motorlarına kapalı (gerçek mağaza sanılmasın).
const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
