import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import PlayerSearch from "./components/playersearch/PlayerSearch";
// import Player2Search from "./components/playersearch/Player2Search";
import Layout from "./layout/Layout";
import Home from "./pages/home/Home";
import Compare from "./pages/compare/Compare";
import Tournaments from "./pages/tournaments/Tournaments";
import Profile from "./pages/profile/Profile";


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jamfor" element={<Compare />} />
          <Route path="/tavlingar" element={<Tournaments />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;