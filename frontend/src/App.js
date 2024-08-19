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
import AdminDashboard from './components/Dashboard/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import EventDetails from './components/EventCards/EventDetails';
import EventCards from './components/EventCards/EventCards';
import OrderPage from './components/Order/OrderPage';
import { Elements } from '@stripe/react-stripe-js'; // Import Elements
import { loadStripe } from '@stripe/stripe-js'; // Import loadStripe

// Load your Stripe publishable key
const stripePromise = loadStripe('pk_test_51PfLnZRp56bwUV10pU6P6rVrVCtRXJ7KelIwNOyaiT81SMe6lLBaSW4PTemUmc6L5C4AMbvcZEDX1etBnsA8HP4H00pDrBqvZi');

function App() {
    return (
        <AuthProvider>
            <NotificationsProvider>
                <Router>
                    <Elements stripe={stripePromise}>
                        <div className="App">
                            <Header />
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/" element={<Home />} />
                                <Route path="/organisation" element={<Organisateur />} />
                                <Route path="/description" element={<EvenementView />} />
                                <Route path="/events" element={<EventCards />} />
                                <Route path="/event/:id" element={<EventDetails />} />
                                <Route path="/order/:id" element={<OrderPage />} />
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
                    </Elements>
                </Router>
            </NotificationsProvider>
        </AuthProvider>
    );
}

export default App;
