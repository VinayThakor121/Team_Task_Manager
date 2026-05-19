import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Team Task Manager",
  description: "A modern full-stack task, project, AI, and chat workspace.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
