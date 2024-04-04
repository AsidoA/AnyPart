import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Navbar from "./Components/navBar/nav-bar";
import HomePage from "./Components/HomePageC/HomePage";
import { Route, Routes } from "react-router-dom";

import { AuthProvider } from './Contexts/AuthContext';
import { OrderProvider } from './Contexts/OrderContext';
import { NotificationProvider } from "./Contexts/NotificationContext";
import { CarDetailsProvider } from './Contexts/CarDetailsContext';
import { CartProvider } from './Contexts/CartContext';
import { SSEProvider } from './Contexts/SseContext';


import { PrimeReactProvider } from 'primereact/api';


import UserProfile from "./Components/UserProfile/Profiles";
import PartSearch from "./Components/PartSearch/part-search";
import GarageIndex from './Components/GarageIndex/GarageIndex';
import Admin from "./Components/AdminPage/admin";
import Footer from './Components/Footer/Footer';

axios.interceptors.request.use(function (config) {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

export default function App() {
    const adminRoute = process.env.REACT_APP_ADMIN_ROUTE;

    return (
        <PrimeReactProvider>
            <AuthProvider>
                <CarDetailsProvider>
                    <CartProvider>
                        <OrderProvider>
                            <NotificationProvider>
                                <SSEProvider>
                                    <div>
                                        <Navbar />
                                        <main>
                                            <Routes>
                                                <Route path="/" element={<HomePage />} />
                                                <Route path="/choosepart" element={<PartSearch />} />
                                                <Route path="/garageindex" element={<GarageIndex />} />
                                                <Route path="/profile" element={<UserProfile />} />
                                                <Route path={adminRoute} element={<Admin />} />
                                            </Routes>
                                        </main>
                                        <Footer/>
                                    </div>
                                </SSEProvider>
                            </NotificationProvider>
                        </OrderProvider>
                    </CartProvider>
                </CarDetailsProvider>
            </AuthProvider>
        </PrimeReactProvider>
    )
}