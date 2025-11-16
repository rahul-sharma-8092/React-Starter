import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/hooks";
import { logout } from "../redux/features/auth/authSlice";
import { useLoggedInUser } from "../hooks/useLoggedInUser";

const Layout = ({ children }: { children: ReactNode }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const loggedInUser = useLoggedInUser();

    async function handleLogOut() {
        const result = await dispatch(logout());
        console.log("Logout response: ", result);

        navigate("/login");
    }

    return (
        <div className='min-h-screen flex flex-col bg-gray-50'>
            <header className='bg-white shadow-sm border-b border-gray-200'>
                <div className='container mx-auto px-6 py-4 flex items-center justify-between'>
                    <Link to='/' className='flex items-center space-x-2'>
                        <span className='text-2xl'>🏥</span>
                        <span className='text-lg font-semibold text-gray-800'>
                            Hospital Management
                        </span>
                    </Link>

                    <nav className='flex items-center space-x-6'>
                        {loggedInUser && (
                            <p>
                                Welcome!&nbsp;
                                <strong>{loggedInUser.name}</strong>
                            </p>
                        )}

                        {loggedInUser && loggedInUser.role === "user" && (
                            <Link
                                to='/dashboard'
                                className={`text-sm font-medium ${
                                    location.pathname === "/dashboard" ||
                                    location.pathname === "/"
                                        ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                                        : "text-gray-600 hover:text-blue-600"
                                }`}>
                                Dashboard
                            </Link>
                        )}

                        {loggedInUser && loggedInUser.role === "admin" && (
                            <Link
                                to='/dashboard'
                                className={`text-sm font-medium ${
                                    location.pathname === "/dashboard" ||
                                    location.pathname === "/"
                                        ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                                        : "text-gray-600 hover:text-blue-600"
                                }`}>
                                Admin_Dashboard
                            </Link>
                        )}

                        <Link
                            to='/patients'
                            className={`text-sm font-medium ${
                                location.pathname === "/patients" ||
                                location.pathname === "/"
                                    ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                                    : "text-gray-600 hover:text-blue-600"
                            }`}>
                            Patients
                        </Link>

                        {loggedInUser && (
                            <button
                                onClick={handleLogOut}
                                className='bg-blue-600 text-white text-sm px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-all'>
                                Logout
                            </button>
                        )}
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className='grow'>
                <div className='container mx-auto py-2'>{children}</div>
            </main>

            {/* Footer */}
            <footer className='bg-white border-t border-gray-200 py-4'>
                <div className='container mx-auto px-6 text-center text-sm text-gray-500'>
                    &copy; 2025 Hospital Patient Management System. All rights
                    reserved.
                </div>
            </footer>
        </div>
    );
};

export default Layout;
