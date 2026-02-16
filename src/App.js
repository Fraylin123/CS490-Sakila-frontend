import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import './App.css';
import Home from "./pages/Home.js"
import Films from "./pages/Films.js"
import Customers from "./pages/Customers.js"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/films" element={<Films />} />
        <Route path="/customers" element={<Customers />} />
      </Routes>

      
    </Router>
  );
}

export default App;
