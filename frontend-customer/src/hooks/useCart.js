import { useState, useEffect } from 'react';

export const useCart = () => {
    const [cart, setCart] = useState([]);

    const addItem = (item) => {
        setCart((prev) => [...prev, item]);
    };

    const removeItem = (id) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
    };

    return { cart, addItem, removeItem, clearCart };
};
