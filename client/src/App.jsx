import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router';
import Header from './Header';

function App() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
}

export default App;
