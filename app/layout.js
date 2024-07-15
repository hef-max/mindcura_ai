import { AuthProvider } from "./authContext";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MindCura",
  description: "Generate ur moral",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider> {children} </AuthProvider>
      </body>
    </html>
  );
}
