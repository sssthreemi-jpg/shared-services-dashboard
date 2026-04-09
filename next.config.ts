import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Render 배포 시 standalone 모드로 빌드 → node_modules 없이 실행 가능, 이미지 크기 대폭 감소
  output: "standalone",
};

export default nextConfig;
