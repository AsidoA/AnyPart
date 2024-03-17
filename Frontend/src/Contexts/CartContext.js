import React, { createContext, useState, useContext, useEffect } from 'react';

import Cookies from 'js-cookie';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const storedCartDetails = Cookies.get('cartDetails');
        return storedCartDetails ? JSON.parse(storedCartDetails) : [];
    });

    useEffect(()=>{Cookies.set('cartDetails', JSON.stringify(cart))},[cart])

    const addToCart = (item) => {
        setCart((prevCart) => {
            if (item.isClicked) {
                return [...prevCart, item];
            } else {
                return prevCart.filter(cartItem => cartItem._id !== item._id);
            }
        });
    };

    const removeFromCart = (itemId) => {
        setCart((prevCart) => prevCart.filter((item) => item._id !== itemId));
    };

    const clearCart = () => {
        setCart([]);
        Cookies.remove('cartDetails');
    };

    return (
        <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};