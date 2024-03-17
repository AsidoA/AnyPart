import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

import { useAuth } from './AuthContext';
import { useOrderContext } from './OrderContext'


const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [update, setUpdate] = useState(false);
    const { setUpdateOrders } = useOrderContext();
    const { user } = useAuth();

    const [notificationsCount, setNotificationsCount] = useState(0);
    useEffect(() => {
        if (user !== null) {
                    if (user.type !== 'Supplier') {
                        axios.get(process.env.REACT_APP_SROUTE +`/notifications/${user.email}`, { withCredentials: true })
                            .then((data) => {
                                setNotifications(data.data);
                                const filteredNotifications = data.data.filter(notification => !notification.status.includes(user.email));
                                setNotificationsCount(filteredNotifications.length);
                                if (update) setUpdate(false);
                            });
                    }
                    else {
                        axios.get(process.env.REACT_APP_SROUTE +`/notifications`, { withCredentials: true })
                            .then((data) => {
                                setNotifications(data.data);
                                const filteredNotifications = data.data.filter(notification => !notification.status.includes(user.email));
                                setNotificationsCount(filteredNotifications.length);
                                if (update) setUpdate(false);
                            });
                    }
        }
    }, [user, update]);

    const deleteNotification = async (notificationId) => {
        try {
            await axios.delete(process.env.REACT_APP_SROUTE + `/notifications/${notificationId}`, { withCredentials: true });
            setUpdate(true);
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const addNewNotification = async (carTitel, Oid) => {
        try {
            await axios.post(process.env.REACT_APP_SROUTE + '/notifications', {
                fullNameShortCut: sessionStorage.getItem('userFullName'), titel: `Order Number ${Oid}`, content: `Order for ${carTitel} Has Been Created By  Click to see it in youre profile`, type: 'private/supplier', oid: Oid
            }, { withCredentials: true }).then(() => { sessionStorage.setItem('Cart', []); })
            setTimeout(() => {
                setUpdate(true);
                setUpdateOrders(true)
            }, 1000);
        } catch (error) {
            console.error('Error adding notification:', error);
        }
    };

    const addOrderUpdatedNotification = async (Oid, orderUid, userName) => {
        try {
            let fullNameShortCut = sessionStorage.getItem('userFullName');

            await axios.post(process.env.REACT_APP_SROUTE + '/notifications', {
                fullNameShortCut: fullNameShortCut,
                uid: orderUid, titel: `Order Number ${Oid}`, content: `Offer from ${userName} Has Been Updated Click to see it in youre profile`,
                type: 'private', oid: Oid
            }, { withCredentials: true }).then(() => { sessionStorage.setItem('Cart', []); },)
            setTimeout(() => {
                setUpdate(true);
            }, 1000);
        } catch (error) {
            console.log(error);
        }
    }

    const updateNotificationStatus = (notificationId) => {
        axios.put(process.env.REACT_APP_SROUTE + `/notifications/${notificationId}`, {
            status: 'read',
        }, { withCredentials: true }).then(() => { setUpdate(true); }).then(() => {
            setUpdate(true);
        }).catch(error => { console.log(error) })
    }


    return (
        <NotificationContext.Provider value={{
            notifications, setUpdate, deleteNotification, addNewNotification
            , addOrderUpdatedNotification, updateNotificationStatus, notificationsCount
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotificationContext = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotificationContext must be used within a NotificationProvider');
    }
    return context;
};