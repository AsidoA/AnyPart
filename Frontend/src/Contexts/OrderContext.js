import React, { createContext, useContext, useState, useEffect } from 'react';

import axios from 'axios';
import { useAuth } from '../Contexts/AuthContext';


const OrderContext = createContext();
export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [updateOrders, setUpdateOrders] = useState(false);

    const { user } = useAuth();

    useEffect(() => {
        if (user !== null) {
            if (user.type !== 'Supplier') {
                axios.get(process.env.REACT_APP_SROUTE +`/orders/${user.email}`, { withCredentials: true })
                    .then((response) => {
                        setOrders(response.data);
                        if (updateOrders) return setUpdateOrders(false);
                    });
            } else if (user.type === 'Supplier') {
                axios.get(process.env.REACT_APP_SROUTE +`/orders/`, { withCredentials: true })
                    .then((response) => {
                        setOrders(response.data);
                        if (updateOrders) return setUpdateOrders(false);
                    });
            }
        }
    }, [updateOrders, user]);

    return (
        <OrderContext.Provider value={{ orders, setOrders, setUpdateOrders }}>
            {children}
        </OrderContext.Provider>
    );
};


export const useOrderContext = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrderContext must be used within an OrderProvider');
    }
    return context;
};