import React, { createContext, useContext, useEffect } from 'react';
import { useNotificationContext } from './NotificationContext';
import { useOrderContext } from './OrderContext';


const SSEContext = createContext();

export const SSEProvider = ({ children }) => {
    const { setUpdate } = useNotificationContext();
    const {setUpdateOrders } = useOrderContext();

    useEffect(() => {
        const eventSource = new EventSource(process.env.REACT_APP_SROUTE +'/sse');

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if(data.message === 'Update Not'){ setUpdate(true)};
            if(data.message === 'Update Order'){ setUpdateOrders(true)};
        };

        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    });

    const value = {};

    return <SSEContext.Provider value={value}>{children}</SSEContext.Provider>;
};

export const useSSE = () => {
    const context = useContext(SSEContext);
    if (!context) {
        throw new Error('useSSE must be used within an SSEProvider');
    }
    return context;
};

export default SSEContext;
