/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Timeweb иногда ломает /_next/image (400). Отключаем оптимизацию,
    // чтобы <Image /> рендерился как обычный <img src="/photos/..." />.
    unoptimized: true,
  },
};

export default nextConfig;
