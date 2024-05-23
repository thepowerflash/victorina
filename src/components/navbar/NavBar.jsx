import React, { useState } from "react";
import { Link } from "react-router-dom";
import './navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        
      </div>
      <div className={`navbar-menu ${isMenuOpen ? "is-active" : ""}`}>
        <Link to="/" className="navbar-link">
          Игра
        </Link>
        <Link to="/about" className="navbar-link">
          Счет
        </Link>
      </div>
      <div className="navbar-burger" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default Navbar;
