// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { createAnimatedIcon } from '../Utils'

import axios from 'axios';
import Cookies from 'js-cookie';


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState(() => {
    const storedUser = Cookies.get('User');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) Cookies.set('User', JSON.stringify(user), { expires: 7200 });
    else Cookies.remove('User');
  }, [user]);

  const signIn = () => {
      axios.get(process.env.REACT_APP_SROUTE + '/cookie', { withCredentials: true,headers:{'Authorization': `Bearer ${Cookies.get('token')}`,'Content-Type': 'application/json'}}).then((response) => {
        setUser(response.data);
        if (response.data.type === process.env.REACT_APP_TYPE)
          navigate(process.env.REACT_APP_ADMIN_ROUTE)
      }).catch(err => { console.log(err) })
  };

  const signOut = () => {
    setUser(null);
    Cookies.remove('User');
    Cookies.remove('carDetails');
    Cookies.remove('cartDetails');
    axios.get(process.env.REACT_APP_SROUTE + '/users/logout', { withCredentials: true });
    navigate('/');
    setTimeout(() => { window.location.reload(); }, 200);
  };

  if (user) {
    axios.get(process.env.REACT_APP_SROUTE + '/cookie', { withCredentials: true,headers:{'Authorization': `Bearer ${Cookies.get('token')}`,'Content-Type': 'application/json'}})
      .then(() => { return true; }).catch(() => {
        setVisible(true);
        return false;
      });
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
      <div className="card flex justify-content-center">
        <Dialog visible={visible} style={{ width: '30vw',minWidth: '20rem' }} onHide={() => setVisible(false)}>
          <div className="text-center">
            {createAnimatedIcon(
              "https://cdn.lordicon.com/oxbjzlrk.json",
              "loop",
              "primary:#121331,secondary:#e88c30",
              { width: '150px', height: '150px', }
            )}
            <h3>Session Is Expired</h3>
            <p>Please Reconnect to your account to make actions</p>
            <Button label="OK" severity="warning" onClick={()=>{signOut();}} text />
          </div>
        </Dialog>
      </div>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}