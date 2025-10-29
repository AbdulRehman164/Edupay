import { Link } from 'react-router';
const Header = () => {
    return (
        <header>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/employees">Employees</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
