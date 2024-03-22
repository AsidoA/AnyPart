import React, { useEffect, useState } from "react";

import { Popup } from "reactjs-popup";
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from "primereact/inputtext";
import { useToast } from '../useToastC/useToast';
import { Toast } from 'primereact/toast';

import { useNotificationContext } from '../../Contexts/NotificationContext';
import { useAuth } from '../../Contexts/AuthContext';

import axios from 'axios';
import './OrderDetails.css'

export default function OrderDetails({ order }) {
    const [productStates, setProductStates] = useState({});
    const [parts, setParts] = useState([]);

    const { user } = useAuth();
    const { toast, toastBC, confirm } = useToast();
    const { addOrderUpdatedNotification } = useNotificationContext();

    //Create order details
    useEffect(() => {
        if (order && order.parts) {
            const initialProductStates = {};
            order.parts.forEach(part => {
                initialProductStates[part._id] = { state: null, price: null, checked: false };
            });
            setProductStates(initialProductStates);
        }
    }, [order]);

    //Supllier View
    const handlePriceUpdateBtn = (rowData) => {
        const updatedRowData = {
            ...rowData,
            price: productStates[rowData._id]?.price,
        };

        setParts((prevParts) => [...prevParts, updatedRowData]);

        setProductStates((prevStates) => ({
            ...prevStates,
            [rowData._id]: {
                ...prevStates[rowData._id],
                checked: true,
            },
        }));

    };

    const handleInStock = (id) => {
        setProductStates((prevState) => ({
            ...prevState,
            [id]: { state: true, price: 0 },
        }));
    };

    const handleNotInStock = (rowData) => {
        const { _id } = rowData;

        setProductStates((prevState) => ({
            ...prevState,
            [_id]: { state: false, price: 'Not In Stock' },
        }));

        const updatedRowData = {
            ...rowData,
            price: 0,
        };

        setParts((prevParts) => [...prevParts, updatedRowData]);
    };

    const handleSendOffer = (action) => {
        const hasNullFields = Object.values(productStates).some((product) => product.state === null || product.price === null);
        if (hasNullFields) { return confirm('Cant Send Empty Offer', 'Please Fill All Fields And Then Send The Offer', 'pi-exclamation-triangle') }

        axios.put(process.env.REACT_APP_SROUTE + `/orders/${order._id}`, parts, { withCredentials: true }).then(() => {
            addOrderUpdatedNotification(order._id, order.Uid, user.fullname)
            confirm('Offer Sent !', 'Youre Offer Is Sent To The User Succesfully', 'pi-cloud-upload', action)
        }).catch((err) => { console.log(err) })


    }

    const offerBody = (rowData) => {
        const { name, _id } = rowData;


        return (
            <div>
                {productStates[_id].state === null ? (
                    <>
                        <div className="flex justify-content-center">
                            <p className="flex text-center mt-3">You Have <span className="font-bold mr-1 ml-1">{name}</span>In Stock ?</p>
                            <div className="buttons-container">
                                <Button icon="pi pi-check" onClick={() => { handleInStock(_id) }} size="small" rounded text severity="warning" aria-label="Filter" className="mr-1" />
                                <Button icon="pi pi-times" onClick={() => { handleNotInStock(rowData) }} rounded text severity="danger" aria-label="Cancel" />
                            </div>
                        </div>
                    </>
                ) : !productStates[_id].state ? (
                    <div className="card flex justify-content-center">
                        <p className="font-bold mt-2 font text-lg">{name} Not In Stock <i className="pi pi-times"></i></p>
                    </div>
                ) : (
                    <div>
                        {!productStates[_id].checked ? (
                            <div className="flex justify-content-center">
                                <InputText value={productStates[_id]?.price || ''} onChange={(e) => setProductStates((prevState) => ({ ...prevState, [_id]: { state: true, price: e.target.value, checked: false } }))} />
                                <div className="ml-5">
                                    <Button icon="pi pi-check" rounded severity="success" onClick={() => { handlePriceUpdateBtn(rowData) }} aria-label="Search" />
                                </div>
                            </div>
                        ) : (
                            <div className="card flex justify-content-center">
                                <p className="font-bold mt-2 font text-lg">{name} Price Updated <i className="pi pi-check"></i></p>
                            </div>
                        )}

                    </div>
                )}
            </div>
        );
    };
    //Supllier View


    //Client View
    const addressBody = (rowData) => { return rowData.Saddress + " " + rowData.Scity }
    const contactBody = (rowData) => {
        return (
            <div>
                <p className="font-bold mt-3">Phone: <span>{rowData.Sphone}</span></p>
                <p className="font-bold mt-1">Email: <span>{rowData.Semail}</span></p>
            </div>
        )
    }
    const priceBody = (partData, rowData) => {
        const part = (rowData.parts).find((part) => part._id === partData._id)

        if (part.price !== 0)
            return <p className="text-xl w-5rem" style={{ color: 'blue', textAlign: 'center' }}>{part.price} $</p>
        else return (
            <div className="not-in-stock" style={{ textAlign: 'center', color: 'red', justifyContent: 'center' }}>
                <p>Not In Stock</p>
                <i className="pi pi-times" style={{ fontSize: '1.5rem' }} />
            </div>
        )
    }
    const offersModal = (partData) => {
        return (
            <Popup
                trigger={
                    <Button
                        label="Click To See Offers For This Part"
                        size="sm"
                        disabled={order.suplliers.length === 0}
                        text />
                }
                modal
                nested
                className="my-popup-offers"
            >
                {(close) => (
                    <div className="modal">
                        <button className="close" onClick={close}>
                            &times;
                        </button>
                        <div className="offers-details">
                            <DataTable value={order.suplliers} showGridlines tableStyle={{ minWidth: '50rem' }}>
                                <Column field="Sfullname" className="font-bold" header="Name"></Column>
                                <Column header="Contact" className="font-bold" body={contactBody}></Column>
                                <Column header="Address" className="font-bold" body={addressBody}></Column>
                                <Column header="Condition" className="font-bold" body={partData.condition} ></Column>
                                <Column header="Price" className="font-bold" body={rowData => priceBody(partData, rowData)}></Column>
                            </DataTable>
                        </div>
                    </div>
                )}
            </Popup>
        )
    }

    const imgBody = (rowData) => {
        return <img className="w-9 sm w-7rem h-7rem shadow-2 block xl:block mx-auto border-round" src={`images/Parts/${rowData.img}`} alt={rowData.img} />
    }

    const bestPriceBody = (rowData) => {
        if (order.suplliers.length === 0) {
            return <p className="text-bold mt-3" style={{ color: 'blue', textAlign: 'center' }}>No Offers yet</p>
        } else {
            let minPrice = Math.max();

            order.suplliers.forEach(supllier => {
                minPrice = Math.max();
                supllier.parts.forEach(part => {
                    if (rowData._id === part._id) {
                        if (part.price > minPrice) {
                            minPrice = part.price;
                        }
                    }
                })

            })
            if(minPrice === 0) return <p className="text-bold mt-3" style={{ color: 'blue', textAlign: 'center' }}>No Relevant Offers yet</p>
            return <p className="text-bold mt-3" style={{ color: 'green', textAlign: 'center' }}>{minPrice} $</p>
        }
    }
    //Client View

    return (
        <Popup
            trigger={
                <Button
                    className="p-button p-button-rounded"
                    icon="pi pi-list"
                    size="sm"
                    rounded severity="success"
                    title="Click To See Details"
                    disabled={order.status.includes(user.email)}
                />
            }
            modal
            nested
            className="my-popup animte__animated animate__backOutUp"
        >
            {(close) => (
                <div className="modal">
                    <button className="close" onClick={close}>
                        &times;
                    </button>
                    <div className="order-details">
                        <img className="brand-img" src={order.brandImg} alt='brand logo' />
                        <div className="car-details">
                            <h1>{order.carTitel}</h1>
                            <h3>Year: {order.carDetails.shnat_yitzur}</h3>
                            <h3>Engine: {order.carDetails.degem_manoa}</h3>
                        </div>
                        {user.type === 'Supplier' && (
                            <div className="text-right mt-4">
                                <Button label="Send Offer" severity="success" size="large" onClick={() => handleSendOffer(close)} rounded />
                            </div>
                        )}
                    </div>
                    <div className="card">
                        {user.type === 'Supplier' ? (
                            <DataTable value={order.parts} paginator rows={5} tableStyle={{ minWidth: '50rem' }}>
                                <Column header="Image" body={rowData => imgBody(rowData)}></Column>
                                <Column field="name" header="Name"></Column>
                                <Column field="categoryName" header="Category"></Column>
                                <Column field="condition" header="Conditon"></Column>
                                <Column header="Offer Price" body={offerBody}></Column>
                            </DataTable>
                        ) : (
                            <DataTable value={order.parts} paginator rows={5} tableStyle={{ minWidth: '50rem' }}>
                                <Column header="Image" body={rowData => imgBody(rowData)}></Column>
                                <Column field="name" header="Name"></Column>
                                <Column field="categoryName" header="Category"></Column>
                                <Column field="condition" header="Conditon"></Column>
                                <Column header="Best Price" body={rowData => bestPriceBody(rowData)}></Column>
                                <Column header="Offers" body={offersModal}></Column>
                            </DataTable>
                        )}
                        <Toast ref={toast} />
                        <Toast ref={toastBC} position="center" />
                    </div>
                </div>
            )}
        </Popup>
    )
}

