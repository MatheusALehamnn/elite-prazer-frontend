import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  eslint: {
    // Desativa a verificação do ESLint durante o build
    ignoreDuringBuilds: true,
  },
  // Outras configurações...
};

export default nextConfig;
