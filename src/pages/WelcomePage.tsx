import React from "react";

const WelcomePage: React.FC = () => {
  return (
    <div
      style={{
      height: "100vh",
      width: "100vw",
      flexDirection: "column"
      }}
    >
      {/* Navbar */}
      <nav style={styles.navbar}>
      <div style={styles.navbarContent}>
        <h2 style={styles.logo}>Gestor de Tareas</h2>
        <div>
        <button
          style={styles.navButton}
          onClick={() => (window.location.href = "/login")}
        >
          Login
        </button>
        <button
          style={styles.navButton}
          onClick={() => (window.location.href = "/register")}
        >
          Register
        </button>
        </div>
      </div>
      </nav>

      {/* Main Content */}
      <main style={{ ...styles.mainContent, flex: 1 }}>
      <h2 style={{ fontWeight: "bold" }}>Bienvenido a tu gestor de Tareas</h2>
      <p>
        Gestor de Tareas es una aplicación diseñada para ayudarte a organizar
        y gestionar tus tareas diarias de manera eficiente. Lleva un
        seguimiento de tus pendientes, establece prioridades y alcanza tus
        metas con facilidad.
      </p>
      </main>
    </div>
  );
};

import { CSSProperties } from "react";

const styles: { [key: string]: CSSProperties } = {
  navbar: {
    backgroundColor: "#b6c0d1",
    padding: "10px 20px",
    color: "white",
  },
  navbarContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    margin: 0,
  },
  navButton: {
    marginLeft: "10px",
    padding: "8px 16px",
    backgroundColor: "white",
    color: "#0078D4",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  mainContent: {
    textAlign: "center",
    marginTop: "50px",
    padding: "0 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    fontSize: "36px",
  },
};

export default WelcomePage;
