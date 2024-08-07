// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationsProvider } from './context/NotificationsContext'; // Correct import
import Header from './components/Header/Header';
import Home from './view/Home';
import EvenementView from './view/EvenementView';
import Organisateur from './view/Organisateur';
import Login from './components/Auth/Login';
import CreateEvent from './components/CreateEvent';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <AuthProvider>
            <NotificationsProvider> {/* Wrap the application with NotificationsProvider */}
                <Router>
                    <div className="App">
                        <Header />
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
                            <Route path="/admin-dashboard/*" element={
                                <PrivateRoute requiredRoles={['admin']}>
                                    <AdminDashboard />
                                </PrivateRoute>
                            } />
                        </Routes>
                    </div>
                </Router>
            </NotificationsProvider>
        </AuthProvider>
    );
}

export default App;
