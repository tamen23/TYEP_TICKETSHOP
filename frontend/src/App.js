import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import UserDashboard from './components/Dashboard/UserDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import OrganisatorDashboard from './components/Dashboard/OrganisatorDashboard';
import OrderPage from './components/Order/OrderPage';
import { Elements } from '@stripe/react-stripe-js'; // Import Elements
import { loadStripe } from '@stripe/stripe-js'; // Import loadStripe
import UserProfile from './view/UserProfile';
import DataPicker from './components/DataPiker/DataPiker';
import PublickFag from './components/Fag/fagManager'
import ManagerFag from './components/Fag/fagManager'

// Load your Stripe publishable key
const stripePromise = loadStripe('pk_test_51PfLnZRp56bwUV10pU6P6rVrVCtRXJ7KelIwNOyaiT81SMe6lLBaSW4PTemUmc6L5C4AMbvcZEDX1etBnsA8HP4H00pDrBqvZi');

function App() {
    return (
        <AuthProvider>
            <NotificationsProvider>
                <Router>
                    <Elements stripe={stripePromise}>
                        <div className="App">
                            <MainContent />
                        </div>
                    </Elements>
                </Router>
            </NotificationsProvider>
        </AuthProvider>
    );
}

function MainContent() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/profil" element={<PrivateRoute> 
                    <UserProfile/>
                </PrivateRoute>} />
                <Route path="/pikerDate" element={<DataPicker />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/publicFag" element={<PublickFag/>} />
                <Route path="/ManagerFag" element={<ManagerFag/>} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/organisation" element={<Organisateur />} />
                <Route path="/description" element={<EvenementView />} />
                <Route path="/events" element={<EventCards />} />
                <Route path="/event/:id" element={<EventDetails />} />
                <Route path="/order/:id" element={<OrderPage />} />
                <Route path="/create-event" element={
                    <PrivateRoute requiredRoles={['organisateur', 'admin']}>
                        <CreateEvent/>
                    </PrivateRoute>
                } />
              
                <Route path="*" element={<ErrorWrapper />} />
                <Route path="/soon" element={<MaintenancePage />} />
                <Route path="/admin-dashboard/*" element={
                    <PrivateRoute requiredRoles={['admin']}>
                        <AdminDashboard/>
                    </PrivateRoute>
                } />
                 <Route path="/organisator-dashboard/*" element={
                    <PrivateRoute requiredRoles={['organisateur']}>
                        <OrganisatorDashboard/>
                    </PrivateRoute>
                } />
                <Route path="/user-dashboard" element={
                    <PrivateRoute>
                        <UserDashboard/>
                    </PrivateRoute>
                } />
            </Routes>
        
        </>
    );
}

function ErrorWrapper() {
    return <ErrorPage />;
}

export default App;
