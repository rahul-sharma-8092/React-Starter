import { useLoggedInUser } from "../hooks/useLoggedInUser";

function AdminDashboard() {
    const user = useLoggedInUser();

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <div>Welcome back! {user?.name}</div>
        </div>
    );
}

export default AdminDashboard;
