"use client";

import { useEffect, useState } from "react";
import "@/styles/header.css";

export default function Header() {
  const [now, setNow] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();

      const datePart = date.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      const timePart = date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setNow(`${datePart} - ${timePart}`);
    };

    updateTime(); // set awal

    const interval = setInterval(updateTime, 1000); // update tiap detik

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-avatar">A</div>

        <div className="header-user">
          <strong className="username">Siwa</strong>
          <small className="role">Owner / Kasir</small>
        </div>
      </div>

      <div className="header-right">
        <span className="header-datetime">{now}</span>
      </div>
    </header>
  );
}
