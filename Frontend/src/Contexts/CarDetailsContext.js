import React, { createContext, useContext, useState } from 'react';

import { useToast } from '../Components/useToastC/useToast';
import { Toast } from 'primereact/toast';


import Translate from 'translate';
import Cookies from 'js-cookie';

const CarDetailsContext = createContext();

export const CarDetailsProvider = ({ children }) => {
    const [carDetails, setCarDetails] = useState(() => {
        const storedCarDetails = Cookies.get('carDetails');
        return storedCarDetails ? JSON.parse(storedCarDetails) : {};
    });

    const { toast, toastBC, confirm } = useToast();

    const addNewCarDetails = (carNumber) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`https://data.gov.il/api/3/action/datastore_search?resource_id=053cea08-09bc-40ec-8f7a-156f0677aff3&q=${carNumber}`);
                const datagov = await response.json();
                const data = datagov.result.records[0];

                if (data !== undefined) {
                    if (carNumber.length === 7) {
                        data.mispar_rechev = carNumber.slice(0, 2) + '·' + carNumber.slice(2, 5) + '·' + carNumber.slice(5);
                    } else {
                        data.mispar_rechev = carNumber.slice(0, 2) + '·' + carNumber.slice(2, 5) + '·' + carNumber.slice(5);
                    }

                    const translationResult = await Translate(data.tozeret_nm, { from: 'he', to: 'en' });
                    var index = translationResult.includes('-') ? translationResult.indexOf('-') : translationResult.indexOf(' ');

                    data["carTitel"] = (translationResult.substring(0, index) + " " + data.kinuy_mishari).toUpperCase();
                    data["brandImg"] = `https://logo.clearbit.com/${translationResult.substring(0, index)}.com?size=100&greyscale=true`;

                    setCarDetails(data);
                    Cookies.set('carDetails', JSON.stringify(data));
                    resolve(true);
                } else {
                    confirm('Error Has Been Occurred', 'Please check the license number you entered or try again later', 'pi-exclamation-triangle')
                    reject(false);
                }
            } catch (error) {
                console.error(error);
                reject(false);
            }
        });
    };


    return (
        <CarDetailsContext.Provider value={{ carDetails, addNewCarDetails }}>
            {children}
            <div className="card flex justify-content-center">
                <Toast ref={toast} />
                <Toast ref={toastBC} position="center" />
            </div>
        </CarDetailsContext.Provider>
    );
};

export const useCarDetailsContext = () => {
    const context = useContext(CarDetailsContext);
    if (!context) {
        throw new Error('useCarDetailsContext must be used within a CarDetailsProvider');
    }
    return context;
};