import { useState } from "react";
import NavBar from "./components/NavBar";
import NewsPage from "./pages/NewsPage";
import Admin from "./pages/Admin";
import Statistics from "./pages/Statistics";
import NewsDetail from "./pages/NewsDetail";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/" element={<NewsPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
