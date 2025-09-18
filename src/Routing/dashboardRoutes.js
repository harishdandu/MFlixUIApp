import React, { createContext, useState, lazy, Suspense } from 'react';
import Customers from '../components/dashboard/customers';
import Airbnb from '../components/dashboard/airbnb';
import Movies from '../components/dashboard/movies';
import ChangePassword from '../components/dashboard/changePassword';



function DashboardRoutes({ selectedComponent, handleComponentSelect }) {
    let componentToRender;
    switch (selectedComponent) {
        case 'Customers':
        case null:
            componentToRender = <Customers />;
            break;
        case 'Airbnb':
            componentToRender = <Airbnb />;
            break;
        case 'Movies':
            componentToRender = <Movies />;
            break;
        case 'ChangePassword':
            componentToRender = <ChangePassword />;
            break;

        default:
            componentToRender = null;
    }

    return (
        <div className="row h-full" style={{ paddingInline: '0px' }}>
            {componentToRender}
        </div>


    );
}


export default DashboardRoutes;