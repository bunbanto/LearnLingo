import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { Header } from "./Header";
import { Home } from "./Home";
import { Teachers } from "./Teachers";
import { Favorites } from "./Favorites";
import { Modal } from "./Modal";
import { LoginForm, RegisterForm } from "./AuthForms";

import "./App.css";

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  if (isLoading) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <div className="app-container">
      <Header
        onLoginOpen={() => setIsLoginOpen(true)}
        onRegisterOpen={() => setIsRegisterOpen(true)}
      />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route
            path="/favorites"
            element={isAuthenticated ? <Favorites /> : <Navigate to="/" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {isLoginOpen && (
        <Modal onClose={() => setIsLoginOpen(false)}>
          <LoginForm onSuccess={() => setIsLoginOpen(false)} />
        </Modal>
      )}
      {isRegisterOpen && (
        <Modal onClose={() => setIsRegisterOpen(false)}>
          <RegisterForm onSuccess={() => setIsRegisterOpen(false)} />
        </Modal>
      )}
    </div>
  );
}

export default App;
