import "./globals.css";
import Header from "./components/header";

export const metadata = {
  icons: {
    icon: "/abjLogo.png",
  },
  title: "MDS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        
          <Header />
          {children}
      </body>
    </html>
  );
}
