import React, { useEffect, useState } from "react";

import { Avatar } from 'primereact/avatar';
import { Chip } from 'primereact/chip';
import { Divider } from 'primereact/divider';
import { Fieldset } from 'primereact/fieldset';
import { Knob } from 'primereact/knob';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';


import { useOrderContext } from '../../Contexts/OrderContext';
import { createAnimatedIcon } from '../../Utils'
import { useAuth } from '../../Contexts/AuthContext';

import axios from 'axios';

import "./Profiles.css";
import OrderDetails from "./OrderDetails";

export default function UserProfile() {
    const [loading, setLoading] = useState(false);

    const { orders, setOrders } = useOrderContext();
    const { user } = useAuth();

    useEffect(() => {setTimeout(() => { setLoading(true); }, 2000)});

    const imageBodyTemplate = (order) => {
        return <img src={order.brandImg} alt={order.carTitel} className="w-4rem border-round" />;
    };

    const statusBodyTemplate = (order) => {
        const severity = getSeverity(order);
        return <Tag value={severity === 'danger' ? 'CLOSED' : 'OPENED'} severity={severity}></Tag>;
    };

    const getSeverity = (order) => {
        const userExistsInStatus = order.status.some(supplierEmail => supplierEmail === user.email);
        return userExistsInStatus ? 'danger' : 'success';
    };

    const orderBodyTemplate = (order) => {
        return <OrderDetails order={order} />;
    };

    const deleteOrderBodyTemplate = (order) => {
        return <Button icon="pi pi-times" rounded severity="danger" onClick={() => DeleteOrder(order)} aria-label="Cancel" />;
    };

    const DeleteOrder = (order) => {
        axios.delete(process.env.REACT_APP_SROUTE+`/orders/${order._id}`, { withCredentials: true })
            .then(() => {
                setOrders((prevOrders) => prevOrders.filter(o => o._id !== order._id));
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Orders</span>
        </div>
    );

    const showEmptyMessage = () => {
        return (
            <div className="card text-center">
                {createAnimatedIcon(
                            "https://cdn.lordicon.com/isrpughu.json",
                            "loop",
                            "primary:#000000,secondary:#e88c30",
                            { width: '200px', height: '200px', marginBottom: '-50px' }
                        )}
                <h1>NO ORDERS YET</h1>
                <p className="text-base">Its looks like you didn't created any order yet <br /> when you create one you will be able to see it her</p>
            </div>
        )
    }

    return (
        <div className={window.innerWidth <= 768 ? '' : 'container'}>
            {!loading ? (<ProgressSpinner className="progress-spinner" strokeWidth="8" />) : (
                <>
                    <Fieldset className="ml-6 mt-4 shadow-2" style={{ width: '350px' }}>
                        <div className="img-profile">
                            <Avatar label={user.shortName} size="xlarge" style={{ backgroundColor: '#9c27b0', color: '#ffffff', width: '250px', height: '250px' }} />
                        </div>
                        <h2>{user.fullname}</h2>
                        <div className="user-details-container">
                            <Divider />
                            <h4><Chip label="City" /> {user.city}</h4>
                            <Divider />
                            <h4><Chip label="Address" /> {user.address}</h4>
                            <Divider />
                            <h4><Chip label="Customer Type" /> {(user.type)}</h4>
                        </div>
                        <Divider />
                        <div className="card justify-content-center cars-knob">
                            <Knob value={0} valueColor="#FF9933" rangeColor="#48d1cc" />
                            <h4>Cars Amount</h4>
                        </div>
                    </Fieldset>
                    <div className="card">
                        {user.type === 'Supplier' ? (
                            <DataTable value={orders} emptyMessage={showEmptyMessage} header={header} tableStyle={{ minWidth: '60rem' }}>
                                <Column field='_id' header="Order ID"></Column>
                                <Column header="Brand" body={imageBodyTemplate}></Column>
                                <Column field="carTitel" header="Name"></Column>
                                <Column field="Odate" header="Date"></Column>
                                <Column header="Status" body={statusBodyTemplate}></Column>
                                <Column header="Order" body={orderBodyTemplate}></Column>
                            </DataTable>) : (
                            <DataTable value={orders} emptyMessage={showEmptyMessage} header={header} tableStyle={{ minWidth: '60rem' }}>
                                <Column className="font-bold" field='_id' header="Order ID"></Column>
                                <Column header="Brand" body={imageBodyTemplate}></Column>
                                <Column field="carTitel" header="Name"></Column>
                                <Column field="Odate" header="Date"></Column>
                                <Column header="Order" body={orderBodyTemplate}></Column>
                                <Column header="Delete" body={deleteOrderBodyTemplate}></Column>
                            </DataTable>
                        )}
                    </div>
                </>
            )}

        </div >
    );
}