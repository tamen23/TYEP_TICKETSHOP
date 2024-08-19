import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationsProvider } from './context/NotificationsContext';
import Header from './components/Header/Header';
import Home from './view/Home';
import EvenementView from './view/EvenementView';
import Organisateur from './view/Organisateur';
import Login from './components/Auth/Login';
import CreateEvent from './components/CreateEvent';
import PrivateRoute from './components/PrivateRoute';
import EventDetails from './components/EventCards/EventDetails';
import EventCards from './components/EventCards/EventCards';
import Contact from './view/Contact';
import ErrorPage from './view/Error';
import Footer from './view/Footer';
import MaintenancePage from "./view/maintenancePage";
import fagPublic from './view/Fag/fagPublic';
import fagManager from './view/Fag/fagManager';

function App() {
    return (
        <AuthProvider>
            <NotificationsProvider>
                <Router>
                    <div className="App">
                        <MainContent />
                    </div>
                </Router>
            </NotificationsProvider>
        </AuthProvider>
    );
}

function MainContent() {
    const location = useLocation();

    return (
        <>
            <Header />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path='/contact' element={<Contact />} />
                <Route path="/organisation" element={<Organisateur />} />
                <Route path="/description" element={<EvenementView />} />
                <Route path="/events" element={<EventCards />} />
                <Route path="/event/:id" element={<EventDetails />} />
                <Route path="/create-event" element={
                    <PrivateRoute requiredRoles={['organisateur', 'admin']}>
                        <CreateEvent />
                    </PrivateRoute>
                } />
                <Route path="/fag-public" element={<fagPublic />} />
                <Route path="/fag-manager" element={
                        <fagManager />

                } />
                <Route path="*" element={<ErrorWrapper />} />
                <Route path="/soon" element={<MaintenancePage />} />
            </Routes>

            <Footer />
        </>
    );
}

function ErrorWrapper() {
    return <ErrorPage />;
}

export default App;
