import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Canvas from "./canvas/index.jsx";
import Customizer from "./pages/Customizer.jsx";
import Home from "./pages/Home.jsx";
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import SavedDesigns from './pages/SavedDesign.jsx';
import CommunityPage from './pages/Community.jsx';
// import Navbar from './components/Navbar.jsx'; // create this as above

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <main className="app transition-all ease-in">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* registering the route for editing the exiting design
           */}
          <Route path="/customizer/:designId" element={<Customizer />} />
          <Route path="/customizer" element={<Customizer />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/saved-designs" element={<SavedDesigns />} />
          <Route path="/community" element={<CommunityPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
