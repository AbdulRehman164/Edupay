import { Link } from 'react-router';
const Header = () => {
    return (
        <header>
            <nav className="bg-teal-400 text-white font-bold p-4">
                <ul className="flex gap-5">
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
