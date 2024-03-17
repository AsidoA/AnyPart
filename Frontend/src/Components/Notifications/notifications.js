/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Divider } from 'primereact/divider';
import { Avatar } from 'primereact/avatar';
import { useNavigate } from "react-router-dom";
import { Badge } from 'primereact/badge';

import { createAnimatedIcon } from '../../Utils'
import { useNotificationContext } from '../../Contexts/NotificationContext';
import { useAuth } from '../../Contexts/AuthContext';



import './notifications.css'


export default function Notifications() {
    const { notifications, notificationsCount } = useNotificationContext();
    const [visibleRight, setVisibleRight] = useState(false);
    const [noEarlierNotifications, setnoEarlierNotifications] = useState(false);
    const [noLastNotifications, setNoLastNotifications] = useState(false);


    const currentDate = new Date();
    const twentyFourHoursAgo = new Date(currentDate - 24 * 60 * 60 * 1000);

    const updateVisibleRight = (value) => {
        setVisibleRight(value);
    };

    const lastNotificationsBody = notifications
        .filter((notification) => {
            const notificationDate = new Date(notification.timestamp);
            return notificationDate > twentyFourHoursAgo;
        })
        .map((notification, index) => (
            <React.Fragment key={index}>
                <Notification
                    key={`notification-${index}`}
                    notification={notification}
                    updateVisibleRight={updateVisibleRight}

                />
            </React.Fragment>
        ));

    const earlierNotificationsBody = notifications
        .filter((notification) => {
            const notificationDate = new Date(notification.timestamp);
            return notificationDate < twentyFourHoursAgo;
        })
        .map((notification, index) => (
            <React.Fragment key={index}>
                <Notification
                    key={`notification-${index}`}
                    notification={notification}
                    updateVisibleRight={updateVisibleRight}
                />
            </React.Fragment>
        ));


    useEffect(() => {
        setNoLastNotifications(lastNotificationsBody.length === 0);
        setnoEarlierNotifications(earlierNotificationsBody.length === 0);
    }, [lastNotificationsBody, earlierNotificationsBody]);


    return (
        <div className="card">
            <div className="flex gap-2 justify-content-center">
                <button className="notification-btn" onClick={() => setVisibleRight(true)}>
                    <i className="pi pi-bell notification-icon p-overlay-badge"><Badge value={notificationsCount}></Badge></i>
                </button>
            </div>

            <Sidebar className="w-full md:w-20rem lg:w-30rem" visible={visibleRight} position="right" onHide={() => setVisibleRight(false)}>
                <div className="notifications-container">
                    {noLastNotifications & noEarlierNotifications ? (
                        <div className="no-notifications">
                            {createAnimatedIcon(
                                "https://cdn.lordicon.com/vspbqszr.json",
                                "loop",
                                "primary:#e88c30",
                                { width: '225px', height: '225px',marginTop: '-70px'}
                            )}
                            <h2>No Notifications Yet !</h2>
                            <p>When you get notifications, they'll show up here</p>
                        </div>
                    ) : (
                        <>
                            <div className="today-container">
                                <h2>Last 24 Hours</h2>
                                <div className="notification-container">
                                    {lastNotificationsBody}

                                    {noLastNotifications && (
                                        <div className="empty-container">
                                            <h4>No Last Notifications Yet</h4>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="earlier-container">
                                <h2>Earlier</h2>
                                <div className="notification-container">

                                    {noEarlierNotifications && (
                                        <div className="empty-container">
                                            <h4>No Earlier Notifications Yet</h4>
                                        </div>
                                    )}

                                    {earlierNotificationsBody}
                                </div>
                            </div>
                        </>
                    )}

                </div>
            </Sidebar>
        </div>
    )
}

const Notification = ({ notification, updateVisibleRight }) => {
    const { deleteNotification, updateNotificationStatus } = useNotificationContext();
    const { user } = useAuth();

    const navigate = useNavigate();

    const opacity = notification.status.includes(user.email) ? '0.7' : 'none'

    return (
        <div className="card flex">
            <div style={{ opacity }} className='notification-card' onClick={() => { navigate('/profile'); setTimeout(() => { updateVisibleRight(false) }, 500); updateNotificationStatus(notification._id) }}>
                <Divider />
                <p className='notification-titel font-bold'>{notification.titel}</p>
                <div className="notification card flex flex-row">
                    <Avatar className="mr-3 p-2" size="large" label={notification.fullNameShortCut} style={{ backgroundColor: '#2196F3', color: '#ffffff', width: '70px' }} />
                    <p className='mt-2'>{notification.content}</p>
                </div>
            </div>
            <div>
                <button className="notification-card-btn" onClick={() => { deleteNotification(notification._id) }}><i className="pi pi-times" /></button>
            </div>
        </div>
    );
};