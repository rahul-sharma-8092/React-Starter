import { toast } from "react-toastify";
import { useLoggedInUser } from "../hooks/useLoggedInUser";
import { pingService } from "../services/ping/pingService";
import { AxiosError } from "axios";

function AdminDashboard() {
    const user = useLoggedInUser();

    async function handleTestPing() {
        setInterval(async () => {
            try {
                const { data } = await pingService.getAdminPing();
                console.log("Res with number: ", data);
                toast.success(data);
            } catch (error) {
                if (error instanceof AxiosError) {
                    toast.error(error.message);
                }
                console.log("Error in getAdminPing: ", error);
            }
        }, 100);
    }

    return (
        <div className='px-7'>
            <h1>Admin Dashboard</h1>
            <div>Welcome back! {user?.name}</div>

            <div className='text-center'>
                <button onClick={handleTestPing} className=''>
                    Test Admin Ping
                </button>
            </div>
        </div>
    );
}

export default AdminDashboard;
