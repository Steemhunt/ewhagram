import "./theme.css";
// removed onchainkit styles
import FooterNav from "@/components/FooterNav";
import GlobalModals from "@/components/GlobalModals";
import GlobalSplash from "@/components/GlobalSplash";
import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Providers } from "./providers";

// KR: 인스타그램 스타일 폰트 구성
// EN: Configure Instagram-like fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// KR: Mini App 메타데이터 구성 (URL/스플래시 등은 환경변수로 주입)
// EN: Build Mini App metadata from env vars
export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL;
  return {
    title: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "ewhagram",
    description:
      "ewhagram • Ewha-themed Instagram-like mini app powered by Farcaster Mini App SDK & mint.club v2",
    other: {
      "fc:miniapp": JSON.stringify({
        version: "1",
        imageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE,
        button: {
          title: `Launch ${process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "ewhagram"}`,
          action: {
            type: "launch_miniapp",
            name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "ewhagram",
            url: URL,
            splashImageUrl: process.env.NEXT_PUBLIC_SPLASH_IMAGE,
            splashBackgroundColor:
              process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR,
          },
        },
      }),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-background text-white ${inter.variable} ${poppins.variable} font-sans`}
      >
        <Providers>
          <GlobalSplash />
          <div className="pb-24">{children}</div>
          <GlobalModals />
        </Providers>
        <FooterNav />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#2d7157",
              color: "#fff",
              fontWeight: "500",
            },
            success: {
              style: {
                background: "#10B981",
              },
            },
            error: {
              style: {
                background: "#EF4444",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
