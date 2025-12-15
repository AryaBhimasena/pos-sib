import "../styles/components.css";

export default function Header() {
  const now = new Date().toLocaleString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-avatar">A</div>

        <div className="header-user">
          <strong className="username">Andi</strong>
          <small className="role">Owner / Kasir</small>
        </div>
      </div>

      <div className="header-right">
        <span className="header-datetime">{now}</span>
      </div>
    </header>
  );
}
