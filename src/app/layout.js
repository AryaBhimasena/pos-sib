import "../styles/components.css";
import "../styles/global.css";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <div className="app-layout">
          <Sidebar />

          <div className="app-main">
            <Header />
            <div className="app-content">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
