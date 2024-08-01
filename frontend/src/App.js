import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from "./components/Header/Header";
import Home from "./view/Home";
import EvenementView from "./view/EvenementView";
import Footer from "./components/Footer/Footer";
import Organisateur from './view/Organisateur';
import Login from './components/Auth/Login';
import CreateEvent from './components/CreateEvent';
import OrganisatorDashboard from './components/Dashboard/OrganisatorDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
    const [isOrganisateurVisible, setIsOrganisateurVisible] = useState(false);

    const handleShowOrganisateur = () => {
        setIsOrganisateurVisible(!isOrganisateurVisible);
    };

    const handleShowApp = () => {
        // Custom logic for showing the App home, if any
    };

    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Header 
                        onShowOrganisateur={handleShowOrganisateur} 
                        onShowApp={handleShowApp}
                    />
                    {isOrganisateurVisible && <div>Organisateur Content</div>}
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<Home />} />
                        <Route path="/organisation" element={<Organisateur />} />
                        <Route path="/description" element={<EvenementView />} />
                        <Route path="/create-event" element={
                            <PrivateRoute requiredRoles={['organisateur', 'admin']}>
                                <CreateEvent />
                            </PrivateRoute>
                        } />
                        <Route path="/admin-dashboard" element={
                            <PrivateRoute requiredRoles={['admin']}>
                                <AdminDashboard />
                            </PrivateRoute>
                        } />
                        <Route path="/organisator-dashboard" element={
                            <PrivateRoute requiredRoles={['organisateur']}>
                                <OrganisatorDashboard />
                            </PrivateRoute>
                        } />
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
