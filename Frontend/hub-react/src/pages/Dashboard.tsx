import { toast } from "react-toastify";
import { useLoggedInUser } from "../hooks/useLoggedInUser";
import { pingService } from "../services/ping/pingService";
import { AxiosError } from "axios";

function Dashboard() {
    const user = useLoggedInUser();

    async function handleTestPing() {
        try {
            const { data } = await pingService.getUserPing();
            toast.success(data);
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.message);
            }
        }
    }

    return (
        <div className='space-y-6 px-7'>
            <div className='flex items-center justify-between'>
                <h1 className='text-3xl font-semibold text-gray-800'>
                    User Dashboard
                </h1>
                <p className='text-gray-500 text-sm'>
                    Welcome back,{" "}
                    <span className='font-medium text-blue-600'>
                        {user?.name || "Guest"}
                    </span>
                    !
                </p>
            </div>

            <div className='p-6 bg-white rounded-2xl shadow-sm border border-gray-100'>
                <h2 className='text-xl font-semibold text-gray-700 mb-4'>
                    Quick Stats
                </h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                    <div className='p-4 bg-blue-50 rounded-xl'>
                        <p className='text-sm text-gray-500'>Total Patients</p>
                        <p className='text-2xl font-bold text-blue-700'>120</p>
                    </div>
                    <div className='p-4 bg-green-50 rounded-xl'>
                        <p className='text-sm text-gray-500'>New Admissions</p>
                        <p className='text-2xl font-bold text-green-700'>8</p>
                    </div>
                    <div className='p-4 bg-yellow-50 rounded-xl'>
                        <p className='text-sm text-gray-500'>Appointments</p>
                        <p className='text-2xl font-bold text-yellow-700'>24</p>
                    </div>
                    <div className='p-4 bg-pink-50 rounded-xl'>
                        <p className='text-sm text-gray-500'>Pending Reports</p>
                        <p className='text-2xl font-bold text-pink-700'>5</p>
                    </div>
                </div>
            </div>

            <div className='text-center'>
                <button onClick={handleTestPing} className=''>
                    Test User Ping
                </button>
            </div>
        </div>
    );
}

export default Dashboard;
