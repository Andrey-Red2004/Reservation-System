import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Reservations from "./pages/Reservations";
import "./App.css";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app-root">
        <header className="app-header p-4 border-b">
          <nav className="max-w-5xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold">Telec Reservas</h1>
            <div className="space-x-4">
              <Link to="/" className="text-blue-600 hover:underline">
                Inicio
              </Link>
              <Link to="/reservas" className="text-blue-600 hover:underline">
                Reservas
              </Link>
            </div>
          </nav>
        </header>

        <main className="max-w-5xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reservas" element={<Reservations />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
