import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/axiosInstance";
import { AxiosError } from "axios";
import { API_ROUTES } from "../services/apiRoutes";
import { useAppDispatch } from "../hooks/hooks";
import { setLoading } from "../redux/features/auth/loadingSlice";

type VerifyEmailParams = {
    id: string;
};

const VerifyEmail: React.FC = () => {
    const { id } = useParams<VerifyEmailParams>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                dispatch(setLoading(true));
                const response = await api.get(
                    `${API_ROUTES.AUTH.VERIFY_EMAIL}/${id}`
                );

                //console.log("Verify Email Response: ", response.data);

                if (response.data.success === true) {
                    setSuccess(true);
                }
            } catch (err) {
                if (err instanceof AxiosError) {
                    setError(
                        err.response?.data?.message || "Something went wrong!"
                    );
                } else {
                    setError("Something went wrong!");
                }
            } finally {
                dispatch(setLoading(false));
            }
        };

        if (id) {
            verifyEmail();
        }
    }, [id]);

    return (
        <div className='flex justify-center items-center min-h-[80vh]'>
            <div className='w-full max-w-lg p-10 bg-white rounded-lg shadow-md'>
                {/* {loading && (
                    <div className='flex justify-center items-center'>
                        <div className='animate-spin border-t-4 border-blue-500 border-solid w-12 h-12 rounded-full'></div>
                    </div>
                )} */}

                {success && (
                    <div className='text-center text-green-600'>
                        <h2 className='text-2xl font-semibold mb-4'>
                            Email Verified Successfully!
                        </h2>
                        <p className='mb-4'>
                            Your email address has been successfully verified.
                            You can now log in.
                        </p>
                        <button
                            onClick={() => navigate("/login")}
                            className='mt-8 px-8 py-3 rounded-full bg-black border hover:border-black border-black/20 text-white backdrop-blur transition-all duration-300 hover:bg-white/20 hover:text-black'>
                            Go to Login
                        </button>
                    </div>
                )}

                {error && (
                    <div className='text-center text-red-600'>
                        <h2 className='text-2xl font-semibold mb-4'>
                            Oops! Something went wrong.
                        </h2>
                        <p className='mb-4'>{error}</p>
                        <button
                            onClick={() => navigate("/")}
                            className='mt-8 px-8 py-3 rounded-full bg-black border hover:border-black border-black/20 text-white backdrop-blur transition-all duration-300 hover:bg-white/20 hover:text-black'>
                            Back to Home
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
