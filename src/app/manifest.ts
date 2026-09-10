import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Delight Fashion",
    short_name: "Delight",
    description: "Delight Fashion - Premium Men's Apparel in Phnom Penh, Cambodia",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#D4AF37",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      }
    ],
  };
}
