import { useLoggedInUser } from "../hooks/useLoggedInUser";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import Unauthorized from "../pages/Unauthorized";

function DashBoardRedirection() {
    const loggedInUser = useLoggedInUser();

    if (loggedInUser && loggedInUser.role === "user") {
        return <Dashboard />;
    } else if (loggedInUser && loggedInUser.role === "admin") {
        return <AdminDashboard />;
    } else {
        return <Unauthorized />;
    }
}

export default DashBoardRedirection;
