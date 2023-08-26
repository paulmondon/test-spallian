import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCog } from '@fortawesome/free-solid-svg-icons'; // Import the heart and gear icons
import "../styles/header.css";
import logo from "../assets/popcorn.png";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Movie App Logo" />
        </Link>
      </div>
      <h1 className="app-title">PopcornFlix</h1>
      <div className="nav-links">
        <Link to="/">
          <FontAwesomeIcon icon={faCog} />
        </Link>
        <Link to="/watchlist">
          <FontAwesomeIcon icon={faHeart} />
        </Link>
      </div>
    </header>
  );
}

export default Header;