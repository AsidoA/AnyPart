import React, { useState } from "react";

import Popup from "reactjs-popup";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from 'primereact/password';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { ProgressSpinner } from 'primereact/progressspinner';
import { SelectButton } from 'primereact/selectbutton';
import { Divider } from 'primereact/divider';
import * as EmailValidator from 'node-email-validation';

import 'primeicons/primeicons.css';
import './registerForm.css'
import axios from "axios";


export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const types = ['Private', 'Supplier'];

  //ReactHookForm
  const defaultValues = {
    username: '',
    phone: '',
    email: '',
    password: '',
    address: '',
    city: '',
    type: ''
  };

  const {
    control,
    setError,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({ defaultValues });
  //ReactHookForm

  //Form Error
  const getFormErrorMessage = (name) => {
    return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
  };

  //Submit the user
  const onSubmit = (data, close) => {
    let email = EmailValidator.is_email_valid(data.email);
    let phone = data.phone
    if (!email)
      setError('email', { type: 'manual', message: 'Invalid email address.', });
    if (phone.length > 10) {
      setError('phone', { type: 'manual', message: 'Invalid mobile number.', });
    }
    else {
      setLoading(true);
      axios.post(process.env.REACT_APP_SROUTE+'/users/reg/', {
        user_name: data.fname + " " + data.lname,
        phone: data.phone,
        email: data.email,
        password: data.password,
        address: data.address,
        city: data.city,
        type: data.type

      }).then(() => {
        setTimeout(() => { reset(); setLoading(false) }, 1000);
      }).catch((result) => {
        if (result.response.status === 409) {
          setError('email', { type: 'manual', message: 'This email is already in use', });
        }
      }).finally(() => {setTimeout(() => { setComplete(true); }, 1000); })
    };
  }

  return (
    <Popup
      trigger={
        <Button className="p-0 m-0 shadow-none" size="sm" text icon="pi pi-pencil" severity="warning" />
      }
      modal
      nested
      className='my-popup-register'
    >
      {(close) => (
        <div className="modal">
          <button className="close" onClick={() => { close(); reset(); setComplete(false) }}>
            &times;
          </button>

          <div className="text-center mb-5">
            <img src="https://ik.imagekit.io/zov6bak1a/logoAny.png?updatedAt=1678872479987" alt="hyper" height={50}
              className="mb-3" />
            <div className="text-900 text-3xl font-medium mb-3"> Sign Up  </div>
            <span className="text-600 font-medium line-height-3">It’s quick and easy</span>
          </div>
          <Divider />

          {loading && (
            <div className="text-center" style={{ marginTop: '220px' }}>
              <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
            </div>
          )}

          {!complete ? (<>
            {!loading && (
              <div className="card flex justify-content-center content-responsive">
                <form onSubmit={(e) => { handleSubmit((data) => onSubmit(data, close))(e); }} className="flex flex-column gap-2" >
                  <div className="flex flex-row">
                    <div className="flex-none mr-4">
                      <Controller name="fname" control={control} rules={{ required: 'First Name is required.' }} render={({ field, fieldState }) => (
                        <>
                          <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}></label>
                          <span className="p-float-label">
                            <InputText id={field.name} value={field.value || ''} className={classNames({ 'p-invalid': fieldState.error,'responsive-input': true })}
                              onChange={(e) => field.onChange(e.target.value)} tooltip="What's your name ?" tooltipOptions={{ position: 'top' }} />
                            <label htmlFor={field.name}>First Name</label>
                          </span>
                          {getFormErrorMessage(field.name)}
                        </>
                      )}
                      />
                    </div>

                    <div className="flex-none">
                      <Controller
                        name="lname"
                        control={control}
                        rules={{ required: 'Last Name is required.' }}
                        render={({ field, fieldState }) => (
                          <>
                            <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}></label>
                            <span className="p-float-label">
                              <InputText id={field.name} value={field.value || ''} className={classNames({ 'p-invalid': fieldState.error,'responsive-input': true })}
                                onChange={(e) => field.onChange(e.target.value)} tooltip="What's your last name ?" tooltipOptions={{ position: 'top' }}
                              />
                              <label htmlFor={field.name}>Last Name</label>
                            </span>
                            {getFormErrorMessage(field.name)}
                          </>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex flex-row mt-3">
                    <div className="flex-none mr-4">
                      <Controller
                        name="phone"
                        control={control}
                        rules={{ required: 'Mobile Number is required.' }}
                        render={({ field, fieldState }) => (
                          <>
                            <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}></label>
                            <span className="p-float-label">
                              <InputText
                                id={field.name} value={field.value}
                                className={classNames({ 'p-invalid': fieldState.error,'responsive-input': true })} onChange={(e) => field.onChange(e.target.value)}
                                type="number" tooltip="Use valid mobile number so people can contact with you." tooltipOptions={{ position: 'right' }}
                              />
                              <label htmlFor={field.name}>Mobile Number</label>
                            </span>
                            {getFormErrorMessage(field.name)}
                          </>
                        )}
                      />
                    </div>

                    <div className="flex-none">
                      <Controller name="email" control={control} rules={{ required: 'Email is required.' }} render={({ field, fieldState }) => (
                        <>
                          <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}></label>
                          <span className="p-float-label">
                            <InputText id={field.name} value={field.value} className={classNames({ 'p-invalid': fieldState.error,'responsive-input': true })}
                              onChange={(e) => field.onChange(e.target.value)} tooltip="You'll use this when you log in." tooltipOptions={{ position: 'top' }} />
                            <label htmlFor={field.name}>Email Address</label>
                          </span>
                          {getFormErrorMessage(field.name)}
                        </>
                      )}
                      />
                    </div>
                  </div>

                  <div className="w-full mt-3">
                    <div className="w-full">
                      <Controller name="password" control={control} rules={{ required: 'Password is required.' }} render={({ field, fieldState }) => (
                        <>
                          <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}></label>
                          <span className="p-float-label">
                            <Password id={field.name} value={field.value} className={classNames({ 'p-invalid': fieldState.error, 'custom-password-input': true })}
                              onChange={(e) => field.onChange(e.target.value)} toggleMask inputStyle={{ width: "99%" }}
                              tooltip="Use strong password to keep your data safe." tooltipOptions={{ position: 'top' }} />
                            <label htmlFor={field.name}>Password</label>
                          </span>
                          {getFormErrorMessage(field.name)}
                        </>
                      )}
                      />
                    </div>
                  </div>

                  <div className="flex flex-row mt-3">
                    <div className="flex-none mr-4">
                      <Controller name="city" control={control} rules={{ required: 'City is required.' }} render={({ field, fieldState }) => (
                        <>
                          <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}></label>
                          <span className="p-float-label">
                            <InputText id={field.name} value={field.value} className={classNames({ 'p-invalid': fieldState.error,'responsive-input': true })}
                              onChange={(e) => field.onChange(e.target.value)}
                              tooltip="Please pick a city so suppliers/clients will know where are you from." tooltipOptions={{ position: 'right' }} />
                            <label htmlFor={field.name}>City</label>
                          </span>
                          {getFormErrorMessage(field.name)}
                        </>
                      )}
                      />
                    </div>

                    <div className="flex-none">
                      <Controller name="address" control={control} rules={{ required: 'Address is required.' }} render={({ field, fieldState }) => (
                        <>
                          <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}></label>
                          <span className="p-float-label">
                            <InputText id={field.name} value={field.value} className={classNames({ 'p-invalid': fieldState.error,'responsive-input': true })}
                              onChange={(e) => field.onChange(e.target.value)} />
                            <label htmlFor={field.name}>Address</label>
                          </span>
                          {getFormErrorMessage(field.name)}
                        </>
                      )}
                      />
                    </div>
                  </div>

                  <div className=" flex justify-content-center">
                    <div className="flex flex-column align-items-center gap-2">
                      <Controller
                        name="type"
                        control={control}
                        rules={{ required: 'User type is required.' }}
                        render={({ field, fieldState }) => (
                          <>
                            <label htmlFor={field.name} className={classNames('flex justify-content-center', { 'p-error': errors.value })}>
                              User Type
                            </label>
                            <SelectButton id={field.name} options={types} {...field} className={classNames('flex justify-content-center', { 'p-invalid': fieldState.error })} />
                            {getFormErrorMessage(field.name)}
                          </>
                        )}
                      />
                    </div>
                  </div>

                  <Button id='registerBt' type="submit" label="Sign up" severity="success" className=" " />
                </form>
              </div>
            )}
          </>) : (
            <div className="card justify-content-center text-center">
              <i className="pi pi-check-circle text-green-500" style={{fontSize:'6rem'}}/>
              <h1 style={{marginBottom:'-12px'}}>Registeration Completed !</h1>
              <h3 className="mb-5">Thank you for registering <span className="text-orange-500">AnyPart</span></h3>
              <p className="text-base">login with the details you provided to creating orders and getting the best offers for your parts .</p>
            </div>
          )}
        </div>
      )}


    </Popup>
  );
}