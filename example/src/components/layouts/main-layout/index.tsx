import { NavLink, Outlet } from "react-router-dom";
import { SIDEBAR_NAV } from "../../../routes/routeConfig";

export default function MainLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: 240,
          borderRight: "1px solid #eee",
          padding: "1rem 0",
          background: "#fafafa",
        }}
      >
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {(["overview", "manage"] as const).map((section) => (
            <div key={section}>
              <div
                style={{
                  padding: "8px 16px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#666",
                  textTransform: "uppercase",
                }}
              >
                {section === "overview" ? "Overview" : "Manage"}
              </div>
              {SIDEBAR_NAV.filter((item) => item.section === section).map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end ?? false}
                  style={({ isActive }) => ({
                    display: "block",
                    padding: "8px 16px 8px 28px",
                    color: isActive ? "#0d6efd" : "#333",
                    textDecoration: "none",
                    fontWeight: isActive ? 600 : 400,
                    background: isActive ? "#e7f1ff" : "transparent",
                  })}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>
      <main style={{ flex: 1, padding: "1.5rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
