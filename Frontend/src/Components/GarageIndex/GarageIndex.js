import React, { useState, useEffect } from 'react';

import { Button } from 'primereact/button';
import { DataScroller } from 'primereact/datascroller';
import { Rating } from 'primereact/rating';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Tag } from 'primereact/tag';
import { createAnimatedIcon } from '../../Utils'

import moment from 'moment-timezone';
import axios from 'axios';
import "./GarageIndex.css"


export default function GarageIndex() {
    const [garages, setgarages] = useState([]);
    const [reviewRate, setreviewRate] = useState(null);
    const [successUpdateReview, setSuccessUpdateReview] = useState(false);

    //Data View
    useEffect(() => {
        axios.get(process.env.REACT_APP_SROUTE + '/garages/').then((response) => {
            setgarages(response.data);
        })
    }, []);

    const getSeverity = (garage) => {
        const currentTime = moment();
        const openTime = moment(garage.ghours[0].open, 'hh:mm A').tz('Israel');
        const closeTime = moment(garage.ghours[0].close, 'hh:mm A').tz('Israel');

        return currentTime.isBetween(openTime, closeTime) ? 'success' : 'danger';
    };

    function calculateAverage(reviews) {
        if (reviews.length === 0) return 0;

        const sum = reviews.reduce((acc, num) => acc + num, 0);
        const average = sum / reviews.length;
        return average;
    };

    const reviewPopup = (event) => {
        confirmPopup({
            group: 'headless',
            target: event.currentTarget,
            message: 'Are you sure you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
        });
    };

    const handelReviewUpdate = (garage) => {
        garage.greview.push(reviewRate);
        axios.put(process.env.REACT_APP_SROUTE + '/garages/' + garage._id, garage, { withCredentials: true }).then(() => {
            setSuccessUpdateReview(true);
        }).catch(err => { return err })
    };


    const itemTemplate = (garage) => {
        return (
            <div className="col-12">
                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                    <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`images/Garages/${garage.gimg}`} alt={garage.name} />
                    <div className="flex flex-column lg:flex-row justify-content-between align-items-center xl:align-items-start lg:flex-1 gap-4">
                        <div className="flex flex-column align-items-center lg:align-items-start gap-3">
                            <div className="flex flex-column gap-1">
                                <div className="text-2xl font-bold text-900">{garage.gname}</div>
                                <div className="text-700">{garage.gdesc}</div>
                            </div>
                            <div className="flex flex-column gap-2">
                                <span className="flex align-items-center gap-2">
                                    <Rating value={calculateAverage(garage.greview)} readOnly cancel={false}></Rating>
                                    <ConfirmPopup
                                        group="headless"
                                        content={() =>
                                            <div className="border-round p-3">
                                                {!successUpdateReview ? (
                                                    <>
                                                        <Rating value={reviewRate} onChange={(e) => setreviewRate(e.value)} />
                                                        <div className="flex align-items-center gap-2 mt-3">
                                                            <Button label="Add" onClick={() => { handelReviewUpdate(garage) }} className="p-button-sm p-button-outlined" />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        {createAnimatedIcon(
                                                            "https://cdn.lordicon.com/gqjpawbc.json",
                                                            "loop",
                                                            "primary:#121331,secondary:#e88c30",
                                                            { width: '100px', height: '100px' }
                                                        )}
                                                    </>
                                                )}

                                            </div>
                                        }
                                    />
                                    <Button className='shadow-none' onClick={reviewPopup} label="Add Review" text></Button>
                                </span>
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-calendar product-category-icon"></i>
                                    <span className="font-semibold">{garage.ghours[0].day} - {garage.ghours[1].day}</span>
                                </span>
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-map-marker product-category-icon"></i>
                                    <span className="font-semibold">{garage.gaddress} | {garage.gcity}</span>
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-row lg:flex-column align-items-center lg:align-items-end gap-4 lg:gap-2">
                            <Tag value={getSeverity(garage) === 'success' ? 'OPEN' : 'CLOSED'} severity={getSeverity(garage)}></Tag>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    //Data View


    return (
        <div className="garage-index-body">
            <div className="header-banner surface-0 mt-3 text-700 text-center bg-orange-400">
                <div className="text-900 font-bold text-5xl mb-1">Garage Index</div>
                <div className="text-700 text-2xl mb-5">Here you can find an extensive index of garages all over the country</div>
            </div>
            <div className="card">
                <DataScroller value={garages} inline itemTemplate={itemTemplate} footer={'If you want publish your garage her please contact us'} rows={5} buffer={0.4} />
            </div>
        </div>
    )
}