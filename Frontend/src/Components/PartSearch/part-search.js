
import './part-search.css'
import React from 'react';
import PartsTable from './dataTable';

export default function PartSearch() {
    return (
        <div className="card animate__animated animate__fadeInDown">
          <div className="data-table-container">
            <div className="data-table">
            <PartsTable/>
            </div>
            <div className="button-list-container">
            </div>
          </div>
        </div>
      );
}