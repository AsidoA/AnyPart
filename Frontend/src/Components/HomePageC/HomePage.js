import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { useNavigate } from "react-router-dom";
import { useToast } from '../useToastC/useToast';
import { Toast } from 'primereact/toast';

import { useCarDetailsContext } from "../../Contexts/CarDetailsContext";
import gridImage from './homepage.png'
import "./HomePage.css";

export default function HomePage() {
  const [carNumber, setCarNumber] = useState(0);
  const { addNewCarDetails } = useCarDetailsContext();
  const { toast, toastBC, confirm } = useToast();
  const navigate = useNavigate();

  async function onClicked() {
    addNewCarDetails(carNumber).then(result => {
      if (result) navigate('/choosepart');
    }).catch((err) =>{if(!err) confirm('Invalid License Number', 'Please check the license number you entered', 'pi-exclamation-triangle');})
  }

  return (
    <div className="search-parts animate__animated animate__fadeIn">
      <div className="grid grid-nogutter surface-0 text-800">
        <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center">
          <section>
            <span className="block text-6xl font-bold mb-1 mt-8">Automotive parts comparison</span>
            <div className="text-5xl text-orange-500 font-bold mb-3 sub_titel">minimum effort maximum options</div>
            <p className="mt-0 mb-4 text-700 line-height-3">Gather price information from multiple suppliers and car lots to compare and find the best deals on used and new car parts</p>
            <span className="p-input-icon-left">
              <i className="pi pi-car input_icon" />
              <InputText onKeyPress={(e) => { if (e.key === 'Enter') onClicked() }} id="carNumberInput" placeholder="Car Number" type="number" className="p-inputtext-lg btn" onChange={(e) => setCarNumber(e.target.value)} />
              <Button onClick={onClicked} icon="pi pi-search" id="search-btn" className="search-btn-icon bg-orange-500 search-btn" severity="secondary" aria-label="Bookmark" />
              <div className="mobile-logo-container">
              <img className="mobile-logo ml-4" alt="mobile logo" src='/mobileLogo.png' />
              </div>
              <Toast ref={toast} />
              <Toast ref={toastBC} position="center" />
            </span>
          </section>
        </div>
        <div className="col-12 md:col-6 overflow-hidden">
          <img src={gridImage} alt="hero-1" className="intro_img" />
        </div>
      </div>
    </div>
  );
}
