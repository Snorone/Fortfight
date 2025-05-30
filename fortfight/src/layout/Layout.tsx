import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Layout.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev: any) => !prev);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="logo">FortFight</h1>

        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="bar top"></span>
          <span className="bar middle"></span>
          <span className="bar bottom"></span>
        </button>

        <nav className={`app-nav ${menuOpen ? "open" : ""}`}>
  <NavLink to="/" onClick={() => setMenuOpen(false)}>Start</NavLink>
  <NavLink to="/jamfor" onClick={() => setMenuOpen(false)}>Quick compare</NavLink>
  <NavLink to="/tavlingar" onClick={() => setMenuOpen(false)}>Competitions</NavLink>
  <NavLink to="/profile" onClick={() => setMenuOpen(false)}>My Profile</NavLink>
</nav>
      </header>
      <main className="app-main">{children}</main>

      <footer className="app-footer">
        <p>
          &copy; {new Date().getFullYear()} FortFight Tobias.hurtig@gritacademy.se
        </p>
      </footer>
    </div>
  );
}
