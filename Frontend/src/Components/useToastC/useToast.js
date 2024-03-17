import React,{ useRef } from 'react';
import { Button } from 'primereact/button';

import './useToast.css';

export function useToast() {
  const toast = useRef(null);
  const toastBC = useRef(null);

  const clear = (submit, close) => {
    toastBC.current.clear();

    if (typeof close === 'function') close();
  };

  const show = (detail, summary) => {
    toast.current.show({
      severity: 'success',
      summary: 'Submission Received',
      detail: 'Thank you, we have received your submission.',
    });
  };

  const confirm = (Titel, Summary, Icon, action) => {
    toastBC.current.show({
      severity: 'error',
      sticky: true,
      className: 'border-none toast-container bg-white shadow-5',
      content: (
        <div className="flex flex-column align-items-center toast-container mt-4 ml-3" style={{ flex: '1' }}>
          <div className="text-center">
            <i className={`pi ${Icon}`} style={{ fontSize: '6rem', color: 'orange' }}></i>
            <div className="font-bold text-xl my-4" style={{ color: 'black' }}>{Titel}</div>
            <p style={{ color: 'black' }}>{Summary}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() =>action ? clear(false, action):clear(false)} type="button" label="OK" className="p-button-primary w-6rem" />
          </div>
        </div>
      ),
    });
  };

  return { toast, toastBC, show, confirm };
}