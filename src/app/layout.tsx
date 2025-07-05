import "./globals.css";
import { UserProvider } from "@/context/UserContext"; // ajuste se não estiver usando /src

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
