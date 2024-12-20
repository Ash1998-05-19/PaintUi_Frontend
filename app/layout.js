import { Inter } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PaintUi",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.7.2/font/bootstrap-icons.css"
      />

      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.2/jspdf.umd.min.js"></script>
      <script src="https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js"></script>
      <body className={inter.className}>{children}</body>
      <ToastContainer autoClose={2000} />
    </html>
  );
}
