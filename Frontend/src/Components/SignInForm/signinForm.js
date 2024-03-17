/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef, useState } from "react";
import { Controller, useForm } from 'react-hook-form';

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Password } from 'primereact/password';

import { Popup } from "reactjs-popup";
import { useAuth } from '../../Contexts/AuthContext'

import axios from "axios";
import "primeflex/primeflex.css";
import "./signinForm.css";

export default function Signin() {
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const { signIn } = useAuth();



  const showError = (message_content) => {
    toast.current.show({ severity: 'error', summary: 'Error', detail: message_content, life: 3000 });
  }

  const defaultValues = {
    email: '',
    password: ''
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues });

  const OnSubmit = (data, close) => {
    setLoading(true);
    axios.post(process.env.REACT_APP_SROUTE+'/users/log/', {
      email: data.email,
      password: data.password
    }, { withCredentials: true }).then((response) => {
      signIn();
      const words = (response.data.split(' ')).map(word => word.slice(0, 1));
      const result = (words.join('')).toUpperCase();
      sessionStorage.setItem('userFullName', result);
      setTimeout(() => { close(); reset(); }, 1000);
    }).catch((result) => {
      if (result.response.status === 409) {
        showError("Email Or Password Are Not Correct")
      }
      else console.log(result.response)
    }).finally(() => { setTimeout(() => { setLoading(false); }, 2000); });
  };


  return (
    <Popup
      trigger={
        <Button
          icon="pi pi-fw pi-user"
          size="sm"
          label=""
          severity="info"
        />
      }
      modal
      nested
    >
      {(close) => (
        <div className="modal" disabled={loading}>
          <button className="close" onClick={close}>
            &times;
          </button>
          <Toast className="toast-edit" ref={toast} />
          <div className="text-center mb-5">
            <img
              src="https://ik.imagekit.io/zov6bak1a/logoAny.png?updatedAt=1678872479987"
              alt="hyper"
              height={50}
              className="mb-3"
            />
            <div className="text-900 text-3xl font-medium mb-3">
              Welcome Back
            </div>
          </div>
          {!loading && (
            <form onSubmit={(e) => { handleSubmit((data) => OnSubmit(data, close))(e); }} >
              <div>
                <label
                  htmlFor="email"
                  className="block text-900 font-medium mb-3 lbl"
                >
                  Email
                </label>
                <Controller name="email" control={control} rules={{ required: ' ' }} render={({ field, fieldState }) => (<>
                  <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}></label>
                  <InputText
                    id={field.name}
                    value={field.value}
                    className={classNames('w-full mb-3', { 'p-invalid': fieldState.error })}
                    placeholder="Email address"
                    onChange={(e) => field.onChange(e.target.value)}
                    disabled={loading}
                  />

                </>
                )}
                />

                <label
                  htmlFor="password"
                  className="block text-900 font-medium mb-3 lbl"
                >
                  Password
                </label>
                <div className="p-inputgroup grp">
                  <Controller name="password" control={control} rules={{ required: ' ' }} render={({ field, fieldState }) => (<>
                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}></label>
                    <Password
                      id={field.name}
                      value={field.value}
                      className={classNames('w-full mb-3', { 'p-invalid': fieldState.error })}
                      placeholder="Password"
                      toggleMask
                      onChange={(e) => field.onChange(e.target.value)}
                      disabled={loading}
                      feedback={false} tabIndex={1}
                    />
                  </>
                  )}
                  />
                </div>

                <div className="flex align-items-center justify-content-between mb-6">
                  <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">
                    Forgot your password?
                  </a>
                </div>
                <Button label="Sign In" type="submit" icon="pi pi-user" severity="success" className="w-full" disabled={loading} />

              </div>
            </form>
          )}

          {loading && (
            <div className="text-center mt-3">
              <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
            </div>
          )}

        </div>
      )}
    </Popup>
  );
}

