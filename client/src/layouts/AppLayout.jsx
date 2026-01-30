import Header from '../navigation/Header';
import { Outlet } from 'react-router';

function AppLayout() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
}

export default AppLayout;
