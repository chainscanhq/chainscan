import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ScanPage from "./pages/ScanPage";
import ProductPage from "./pages/ProductPage";
import AddProductPage from "./pages/AddProductPage";
import WalletContextProvider from "./components/WalletConfig";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <WalletContextProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/add" element={<AddProductPage />} />
        </Routes>
      </Router>
      <Footer />
    </WalletContextProvider>
  );
}

export default App;
