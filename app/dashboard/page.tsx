"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_USER_IDS = ["user_3AP7xokH0oin2NoqgK37ER9Y4su"];

export default function Dashboard() {
  const pathname = usePathname();
  const { user } = useUser();

  const isAdmin = user && ADMIN_USER_IDS.includes(user.id);

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/customers", label: "Customers", icon: "👥" },
    { href: "/playbooks", label: "Playbooks", icon: "⚡" },
    { href: "/widget-messages", label: "Widget", icon: "💬" },
    { href: "/email-campaigns", label: "Email Campaigns", icon: "📧" },
    { href: "/analytics", label: "Analytics", icon: "📈" },
    { href: "/integrations", label: "Integrations", icon: "🔌", adminOnly: true },
    { href: "/admin", label: "Admin Panel", icon: "🔐", adminOnly: true },
    { href: "/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: "250px",
          background: "#1e293b",
          borderRight: "1px solid #334155",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: 700,
            fontSize: "1.25rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              background: "#6366f1",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            🛡️
          </div>
          ChurnGuard
        </div>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            flex: 1,
          }}
        >
          {menuItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null;

            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  color: isActive ? "white" : "#94a3b8",
                  textDecoration: "none",
                  background: isActive ? "#334155" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  transition: "all 0.2s",
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div
          style={{
            marginTop: "auto",
            paddingTop: "1rem",
            borderTop: "1px solid #334155",
          }}
        >
          <Link
            href="/signout"
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              color: "#94a3b8",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <span>🚪</span>
            Sign Out
          </Link>
        </div>
      </aside>

      <main
        style={{
          marginLeft: "250px",
          flex: 1,
          padding: "2rem",
          background: "#0f172a",
          minHeight: "100vh",
        }}
      >
        <h1 style={{ color: "white", fontSize: "2rem", marginBottom: "1rem" }}>
          Dashboard
        </h1>
        <p style={{ color: "#94a3b8" }}>
          Welcome to your ChurnGuard dashboard!
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
            marginTop: "2rem",
          }}
        >
          <div
            style={{
              background: "#1e293b",
              padding: "1.5rem",
              borderRadius: "0.75rem",
              border: "1px solid #334155",
            }}
          >
            <h3 style={{ color: "white", marginBottom: "0.5rem" }}>
              Total Customers
            </h3>
            <p
              style={{ color: "#6366f1", fontSize: "2rem", fontWeight: "bold" }}
            >
              --
            </p>
          </div>
          <div
            style={{
              background: "#1e293b",
              padding: "1.5rem",
              borderRadius: "0.75rem",
              border: "1px solid #334155",
            }}
          >
            <h3 style={{ color: "white", marginBottom: "0.5rem" }}>
              Churn Rate
            </h3>
            <p
              style={{ color: "#6366f1", fontSize: "2rem", fontWeight: "bold" }}
            >
              --
            </p>
          </div>
          <div
            style={{
              background: "#1e293b",
              padding: "1.5rem",
              borderRadius: "0.75rem",
              border: "1px solid #334155",
            }}
          >
            <h3 style={{ color: "white", marginBottom: "0.5rem" }}>
              Active Playbooks
            </h3>
            <p
              style={{ color: "#6366f1", fontSize: "2rem", fontWeight: "bold" }}
            >
              --
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
