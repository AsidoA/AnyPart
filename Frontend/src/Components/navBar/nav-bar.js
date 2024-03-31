import React, { useRef } from 'react';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { TieredMenu } from 'primereact/tieredmenu';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../Contexts/AuthContext';
import { Divider } from 'primereact/divider';

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import "./nav-bar.css"
import Signin from "../SignInForm/signinForm";
import SignUp from "../SignUpForm/registerForm";
import SideBarView from '../PartSearch/sidebarview';
import Notifications from '../Notifications/notifications';


export default function Navbar() {
    const { user, signOut } = useAuth();
    const menu = useRef(null);
    const navigate = useNavigate();

    const Menuitems = [
        {
            label: 'Profile',
            icon: 'pi pi-fw pi-user',
            command: () => { navigate('/profile') }
        },
        {
            separator: true
        },
        {
            label: 'Log Out',
            icon: 'pi pi-fw pi-power-off',
            command: () => { signOut(); }
        }
    ];

    const items = [
        {
            label: 'Part Search',
            icon: 'pi pi-fw pi-search',
            url: '/choosepart',
        },
        {
            label: 'Garage Index',
            icon: 'pi pi-fw pi-book',
            url: '/garageindex',
        }
    ];

    const start = <a href="/"> <img alt="logo" src="https://ik.imagekit.io/zov6bak1a/logoAny.png?updatedAt=1685031605066" height="40" className="mr-2"></img></a>;

    const end = (
        <div className="flex align-items-center gap-2 action-buttons">
            {user &&(<div className='notification-btn'><Notifications /></div>)}
            <div><SideBarView /></div>
            <div><Divider className="divider" layout="vertical" /></div>
            {user ? (
                <div>
                    <TieredMenu model={Menuitems} popup ref={menu} breakpoint="767px" />
                    <Avatar className='avatar-signedin' label={user.shortName} onClick={(e) => menu.current.toggle(e)} />
                </div>
            ) : (
                <>
                    <div className='signin-button'><Signin /></div>
                    <div><SignUp /></div>
                </>
            )}
        </div>
    );


    return (
        <div className="card nav">
            <Menubar model={items} start={start} end={end} />
        </div>
    )
}