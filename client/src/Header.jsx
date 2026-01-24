import { Link } from 'react-router';
const Header = () => {
    return (
        <header className="shadow-sm">
            <nav className="mx-auto flex max-w-7xl items-center justify-between bg-teal-500 px-6 py-4 text-white">
                {/* App Name */}
                <div className="text-xl font-extrabold tracking-wide">
                    Edu<span className="text-teal-100">Pay</span>
                </div>

                {/* Navigation */}
                <ul className="flex items-center gap-6 text-sm font-semibold">
                    <li>
                        <Link
                            to="/"
                            className="rounded-md px-3 py-2 transition hover:bg-teal-600"
                        >
                            Home
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/employees"
                            className="rounded-md px-3 py-2 transition hover:bg-teal-600"
                        >
                            Employees
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/payslips"
                            className="rounded-md px-3 py-2 transition hover:bg-teal-600"
                        >
                            Payslips
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
