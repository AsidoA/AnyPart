import React, { useState } from 'react';

import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { DataScroller } from 'primereact/datascroller';
import { useToast } from '../useToastC/useToast';
import { Toast } from 'primereact/toast';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { createAnimatedIcon } from '../../Utils'

import { useOrderContext } from '../../Contexts/OrderContext';
import { useNotificationContext } from '../../Contexts/NotificationContext';
import { useCarDetailsContext } from '../../Contexts/CarDetailsContext';
import { useCart } from '../../Contexts/CartContext';


import './sidebarview.css'
import axios from 'axios';

export default function SideBarView() {
    const [visible, setVisible] = useState(false);
    const [created, setCreated] = useState(false);
    const [updatedLicensePlate, setupdatedLicensePlate] = useState('');
    const [loading, setLoading] = useState(false);

    const { toast, toastBC, confirm } = useToast();
    const { addNewCarDetails, carDetails } = useCarDetailsContext();
    const { cart, clearCart } = useCart();
    const { setUpdateOrders } = useOrderContext();
    const { addNewNotification } = useNotificationContext();



    const OrderValues = {
        carTitel: carDetails.carTitel,
        carDetails: carDetails,
        parts: cart,
        Odate: new Date(),
        brandImg: carDetails.brandImg
    };

    //Order Handle
    const handleButtonClick = () => {
        axios.post(process.env.REACT_APP_SROUTE + '/orders/', OrderValues, { withCredentials: true }).then((response) => {
            setCreated(true)
            addNewNotification(OrderValues.carTitel, response.data)
            setUpdateOrders(true)
        }).catch((error) => {
            if (error.request.status === 401) {
                confirm('Your Session is Expired', 'You have to login to access this action !', 'pi-exclamation-triangle');
            }
            if (error.request.status === 404) {
                confirm('Cart Is Empty', 'Please Choose Parts To Create Any Order !', 'pi-exclamation-triangle');
            }
        })
    };

    const handleContinueBtn = () => {
        clearCart();
        setCreated(false)
    };
    //Order Handle


    //Button PopUp
    const confirm1 = (event) => {
        confirmPopup({
            group: 'headless',
            target: event.currentTarget,
            message: 'Are you sure you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
        });
    };

    const pInvalidClassName = () => {
        if (updatedLicensePlate === '')
            return 'false shadow-none'
        else if (updatedLicensePlate.length < 7 || updatedLicensePlate.length > 8)
            return 'false shadow-none'
        return 'border-green-500 shadow-none'
    };

    const handleDetailsUpdate = (carNumber) => {
        addNewCarDetails(carNumber).then(() => {
            setLoading(true);
            setTimeout(() => { setLoading(false) }, 2000)
        }).catch((err) => { if (!err) return err; })
    };
    //Button PopUp


    return (
        <div className="card flex justify-content-center sidebar-view">
            <Sidebar className="w-full md:w-20rem lg:w-30rem" visible={visible} onHide={() => setVisible(false)}>
                {carDetails._id ? (
                    <div className="car-details-cart">
                        <div className="car-container animate__animated animate__fadeIn">
                            {!loading ? (
                                <>
                                    <div className="car-logo"><img src={carDetails.brandImg} alt='logo' /></div>
                                    <div className="car_details">
                                        <div className="card flex justify-content-center">
                                            <Toast ref={toast} />
                                            <Toast ref={toastBC} position="center" />
                                        </div>
                                        <div className=" p-sidebar-top details">
                                            <h1 className="car-name">{carDetails.carTitel}</h1>
                                            <h4>Engine Type: {carDetails.degem_manoa}</h4>
                                            <h4>Year: {carDetails.shnat_yitzur}</h4>
                                            <h4>Trim: {carDetails.ramat_gimur}</h4>
                                            <div className="flex flex-row">
                                                <ConfirmPopup
                                                    group="headless"
                                                    content={() =>
                                                        <div className="border-round p-3">
                                                            <span>Enter new license plate to update car details</span>
                                                            <div className="flex align-items-center gap-2 mt-3">
                                                                <InputText className={pInvalidClassName()} value={updatedLicensePlate} onChange={(e) => setupdatedLicensePlate(e.target.value)} keyfilter="int" placeholder="License Plate" />
                                                                <Button label="Update" disabled={pInvalidClassName().includes('false')} onClick={() => handleDetailsUpdate(updatedLicensePlate)} className="p-button-sm p-button-outlined text-green-500" />
                                                            </div>
                                                        </div>
                                                    }
                                                />
                                                <h4 className="license-plate flex-none" onClick={confirm1}>{carDetails.mispar_rechev}</h4>
                                                <div className="update-number">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="loading-spinner card flex justify-content-end mt-3 animate__animated animate__fadeIn">
                                    <i className="pi pi-spin pi-spinner text-orange-500 mr-5" style={{ fontSize: '6rem' }}></i>
                                </div>
                            )}

                        </div>

                        {!created && (
                            <>
                                <div className="products-cart ">
                                    <Divider />
                                    <ProductsCart ></ProductsCart>
                                </div>
                                <div className="btn-create-order">
                                    <Button label="Create Order" className='btn-create-order shadow-none font-light' onClick={handleButtonClick} severity="warning" text raised />
                                </div>
                            </>
                        )}
                    </div>) : (
                    <div className="carNotExist text-center" style={{ textAlign: 'center', marginTop: '6px', marginBottom: 'auto' }}>
                        {createAnimatedIcon(
                            "https://cdn.lordicon.com/rbztokoj.json",
                            "loop",
                            "primary:#121331,secondary:#e88c30",
                            { width: '200px', height: '200px', marginBottom: '-50px', marginTop: '150px' }
                        )}
                        <h2>Missing Car Details</h2>
                        <p>Provide A Vaild <span className="font-bold">License Number </span> And Sign In Your Account To Create An Order </p>
                        <div>
                            <InputText className={pInvalidClassName()} value={updatedLicensePlate} onChange={(e) => setupdatedLicensePlate(e.target.value)} keyfilter="int" placeholder="License Number" />
                        </div>
                        <Button label='Find Your Car' icon="pi pi-search" disabled={pInvalidClassName().includes('false')} onClick={() => handleDetailsUpdate(updatedLicensePlate)} className="p-button-xl text-center text-orange-500 shadow-none" text />
                    </div>
                )}

                {created && (
                    <div className="order-created animate__heartBeat">
                        {createAnimatedIcon(
                            "https://cdn.lordicon.com/zawvkqfy.json",
                            "loop",
                            "primary:#e88c30",
                            { width: '150px', height: '150px', marginTop: '-50px' }
                        )}
                        <h1>Created Successfully !</h1>
                        <p>All the offers will appear in your profile under this car details</p>
                        <div>
                            <Button label="Click to continue" severity="warning" onClick={handleContinueBtn} text />
                        </div>
                    </div>)}
            </Sidebar>
            <button className='sidebarview-btn' onClick={() => setVisible(true)}>
                <i className="pi pi-shopping-cart shopping-cart-icon p-overlay-badge">
                    <Badge value={cart.length}></Badge>
                </i>
            </button>
        </div>
    )
};

export function ProductsCart() {
    const { cart, removeFromCart } = useCart();

    const handleDeleteButton = (productToDelete) => {
        removeFromCart(productToDelete._id);
    };

    const itemTemplate = (data) => {
        return (
            <div className="col-12 cart-container">
                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                    <img className="w-9 sm w-10rem h-10rem shadow-2 block xl:block mx-auto border-round" src={`images/Parts/${data.img}`} alt={data.name} />
                    <div className="flex flex-column lg:flex-row justify-content-between align-items-center xl:align-items-start lg:flex-1 gap-4">
                        <div className="flex flex-column align-items-center lg:align-items-start gap-3">
                            <div className="flex flex-column gap-1 product-card">
                                <div className="text font-bold text-900">{data.name}</div>
                                <div className="text-500">{data.condition}</div>
                            </div>
                            <div className="flex flex-column gap-2">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-th-large product-category-icon"></i>
                                    <span className="font-semibold">{data.categoryName}</span>
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-row lg:flex-column align-items-center lg:align-items-end gap-4 lg:gap-2 buttons-container">
                            <Button icon="pi pi-trash" rounded severity="danger" onClick={() => handleDeleteButton(data)} aria-label="Cancel" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const showEmptyMessage = (
        <div className="card text-center justify-content-center empty-message-container">
            {createAnimatedIcon(
                "https://cdn.lordicon.com/taymdfsf.json",
                "loop",
                "primary:#121331,secondary:#e88c30",
                { width: '150px', height: '150px' }
            )}
            <h2>No Parts Added Yet</h2>
            <p>Choose the parts you need and add them to the cart.<br />They will showed up her</p>
        </div>
    )

    return (
        <div className="card">
            <DataScroller emptyMessage={showEmptyMessage} value={cart} itemTemplate={itemTemplate} rows={5} inline scrollHeight="300px" />
        </div>
    )
};
