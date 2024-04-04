import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import { useToast } from '../useToastC/useToast';
import { Toast } from 'primereact/toast';

import { useCarDetailsContext } from "../../Contexts/CarDetailsContext";
import "./HomePage.css";

export default function HomePage() {
  const [carNumber, setCarNumber] = useState(0);
  const { addNewCarDetails } = useCarDetailsContext();
  const { toast, toastBC, confirm } = useToast();
  const navigate = useNavigate();

  async function onClicked() {
    addNewCarDetails(carNumber).then(result => {
      if (result) navigate('/choosepart');
    }).catch((err) => { if (!err) confirm('Invalid License Number', 'Please check the license number you entered', 'pi-exclamation-triangle'); })
  }


  return (
    <div className="animate__animated animate__fadeIn">
      <div className="search-parts surface-0 text-800 shadow-8">
        <div className="p-6 text-center flex align-items-center sec-div">
          <section className="text-center">
            <img className="full-logo" alt="any-part-logo" src='images/full-logo.png' />
            <span className="block text-white font-bold mb-1 mt-0 titel">Automotive parts comparison</span>
            <div className="text-orange-500 font-bold mb-3 sub_titel">minimum effort maximum options</div>
            <div className="flex justify-content-center">
              <div className="p-inputgroup w-20rem justify-content-center">
                <InputText className="p-inputtext-lg shadow-none border-none bg-white-alpha-30 text-white car-number-input" onKeyPress={(e) => { if (e.key === 'Enter') onClicked() }} placeholder="Car Number" type="number" onChange={(e) => setCarNumber(e.target.value)} />
                <span className="p-inputgroup-addon shadow-none border-none bg-white-alpha-30 text-white search-btn-icon" onClick={onClicked}><i className="pi pi-search"></i></span>
              </div>
            </div>
            {/* <p className="mt-0 mb-4 mt-2 text-700 text-white line-height-3">Gather price information from multiple suppliers and car lots to compare and find the best deals on used and new car parts</p> */}
            <Toast ref={toast} />
            <Toast ref={toastBC} position="center" />
          </section>
        </div>
      </div>
      <div className="surface-0 text-center">
        <div className="mb-3 mt-6 font-bold text-3xl">
          <span className="text-900">One Product, </span>
          <span className="text-orange-500">Many Solutions</span>
        </div>
        <div className="text-700 mb-6">Gather price information from multiple suppliers and car lots to compare and find the best deals on used and new car parts</div>
        <div className="grid">
        <div className="col-12 md:col-4 mb-4 px-5">
            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
              <i className="pi pi-check-circle text-4xl text-orange-500"></i>
            </span>
            <div className="text-900 text-xl mb-3 font-medium">Easy to Use</div>
            <span className="text-700 line-height-3">Enter your number plate, select the parts, and place your order. All your offers will appear in your profile.</span>
          </div>
          <div className="col-12 md:col-4 mb-4 px-5">
            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
              <i className="pi pi-cog text-4xl text-orange-500"></i>
            </span>
            <div className="text-900 text-xl mb-3 font-medium">Built for Garages</div>
            <span className="text-700 line-height-3">As a garage owner or just a client, you can quickly and easily get any part you need.</span>
          </div>
          <div className="col-12 md:col-4 mb-4 px-5">
            <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
              <i className="pi pi-dollar text-4xl text-orange-500"></i>
            </span>
            <div className="text-900 text-xl mb-3 font-medium">Best Priice</div>
            <span className="text-700 line-height-3">Select the optimal price that perfectly aligns with your specific needs and preferences.</span>
          </div>
        </div>
      </div>
    </div>

  );
}
