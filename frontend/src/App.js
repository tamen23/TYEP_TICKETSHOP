import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import Header from "./components/Header/Header";
import Home from "./view/Home";
import EvenementView from "./view/EvenementView";
import Footer from "./components/Footer/Footer";
import Organisateur from './view/Organisateur';
import Login from './components/Auth/Login'; // Import Login component
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute component

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Header />
                    <Routes>
                        <Route path="/login" element={<Login />} /> {/* Add Login Route */}
                        <Route path="/" element={<Home />} /> {/* Accessible to everyone for now */}
                        <Route path="/organisation" element={<Organisateur />} /> {/* Accessible to everyone for now */}
                        <Route path="/description" element={<EvenementView />} /> {/* Accessible to everyone for now */}
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
