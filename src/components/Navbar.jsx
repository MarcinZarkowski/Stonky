import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css'; 
import logo from './stonky_logo.png';

function Navbar({ children }) {
  const navigate = useNavigate(); // Use useNavigate hook for navigation

  const onClick = () => {
    navigate("/logout"); // Programmatically navigate to /logout
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">Stonky</Link>
          <Link to="/">
            <img className="logo-pic" src={logo} alt="stonky logo" />
          </Link>
        </div>
        <ul className="navbar-links">
          <button className="logout-link" onClick={onClick}>Logout</button>
        </ul>
      </nav>
      <main className="content">
        {children}
      </main>
    </>
  );
}

export default Navbar;