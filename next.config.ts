import { NextConfig } from 'next';

const config: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignora erros de tipagem durante o build
    ignoreBuildErrors: true,
  },
  // Outras configurações que você já tenha
  output: "standalone",
};

export default config;
