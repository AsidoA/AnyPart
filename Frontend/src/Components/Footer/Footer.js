import React from "react";
import { Divider } from 'primereact/divider';

export default function Footer() {

    return (
        <div>
            <div className="surface-section px-4 py-6 md:px-6 lg:px-8 text-center">
                <Divider />
                <img src="/logoAny.png" alt="small logo" width="auto" height="60px" />
                <div className="font-medium text-900 mt-4 mb-3">© 2024 AnyPart, Inc</div>
                <p className="text-600 line-height-3 mt-0 mb-4">Cursus metus aliquam eleifend mi. Malesuada pellentesque elit eget gravida. Nunc eget lorem dolor sed viverra ipsum nunc aliquet bibendum. Massa tincidunt dui ut ornare lectus sit amet est placerat</p>
                <div className="flex align-items-center justify-content-center">
                    <a href="https://www.linkedin.com/in/asif-asido" target="_blank" className="cursor-pointer text-700 mr-5" rel="noreferrer"><i className="pi pi-linkedin"></i></a>
                    <a href="mailto:asidoasif@gmail.com" className="cursor-pointer text-700 mr-5"><i className="pi pi-envelope"></i></a>
                    <a href="https://github.com/AsidoA" target="_blank" rel="noreferrer" className="cursor-pointer text-700"><i className="pi pi-github"></i></a>
                </div>
            </div>
        </div>
    )

}
