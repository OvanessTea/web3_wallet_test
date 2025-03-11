import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    ALCHEMY_API_WEBSOCKET: process.env.ALCHEMY_API_WEBSOCKET,
  },
};

export default nextConfig;
