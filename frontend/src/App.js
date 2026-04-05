import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutUsPage";
import PitchToUsPage from "./pages/PitchToUsPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/pitch" element={<PitchToUsPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
