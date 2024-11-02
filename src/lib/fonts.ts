import localFont from "next/font/local";

const geistSans = localFont({
  src: "../app/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../app/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const gilroy = localFont({
  src: "../app/fonts/gilroy.woff2",
  variable: "--font-gilroy-sans",
  weight: "700",
});

const inter = localFont({
  src: "../app/fonts/inter.woff2",
  variable: "--font-inter-sans",
  weight: "500",
});

export { geistSans, geistMono, gilroy, inter };
