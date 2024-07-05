import './App.css';
import Header from "./components/Header/Header";
import Home from "./view/Home";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from "react";
import EvenementView from "./view/EvenementView";
import Footer from "./components/Footer/Footer";

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/description" element={<EvenementView />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
