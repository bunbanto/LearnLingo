import { LogIn } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "./useAuth";
import { signOut, auth } from "./config";

import "./Header.css";

export const Header = ({
  onLoginOpen,
  onRegisterOpen,
}: {
  onLoginOpen: () => void;
  onRegisterOpen: () => void;
}) => {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/" className="logo">
          <span className="logo-mark" aria-hidden="true" />
          <span>LearnLingo</span>
        </Link>
      </div>

      <nav className="nav">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Home
        </NavLink>
        <NavLink
          to="/teachers"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Teachers
        </NavLink>
        {isAuthenticated && (
          <NavLink
            to="/favorites"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Favorites
          </NavLink>
        )}
      </nav>

      <div className="auth-btns">
        {isAuthenticated ? (
          <div className="user-info">
            <span className="username">{user?.displayName}</span>
            <button className="logout-btn" onClick={() => signOut(auth)}>
              Log out
            </button>
          </div>
        ) : (
          <>
            <button className="login-btn" onClick={onLoginOpen}>
              <LogIn size={18} />
              Log in
            </button>
            <button className="register-btn" onClick={onRegisterOpen}>
              Registration
            </button>
          </>
        )}
      </div>
    </header>
  );
};
