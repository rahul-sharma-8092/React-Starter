import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { login } from "../redux/features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "../validations/auth/loginSchema";
import type { RootState } from "../redux/store";
import { useLoggedInUser } from "../hooks/useLoggedInUser";
import { useEffect } from "react";

type FormValues = z.infer<typeof loginSchema>;

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const loggedInUser = useLoggedInUser();
    const { loading, error } = useAppSelector((s: RootState) => s.auth);

    useEffect(() => {
        console.log("Login Page: loggedInUser: ", loggedInUser);
        if (!!loggedInUser && !!loggedInUser.email) {
            navigate("/dashboard", { replace: true });
        }
    }, [loggedInUser]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({ resolver: zodResolver(loginSchema) });

    const onSubmit = async (data: FormValues) => {
        try {
            const result = await dispatch(login(data));
            if (login.fulfilled.match(result)) {
                navigate("/dashboard", { replace: true });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='min-h-full flex items-center justify-center bg-gray-50 px-4'>
            <div className='w-full max-w-md bg-white p-8 rounded-2xl shadow-md'>
                <h1 className='text-2xl font-semibold text-center mb-6 text-gray-800'>
                    Sign In
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                    {/* Email */}
                    <div>
                        <label
                            htmlFor='email'
                            className='block text-sm font-medium text-gray-700 mb-1'>
                            Email Address
                        </label>
                        <input
                            id='email'
                            type='email'
                            {...register("userName")}
                            placeholder='you@example.com'
                            className={`w-full border ${
                                errors.userName
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.userName && (
                            <p className='text-red-600 text-sm mt-1'>
                                {errors.userName.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor='password'
                            className='block text-sm font-medium text-gray-700 mb-1'>
                            Password
                        </label>
                        <input
                            id='password'
                            type='password'
                            {...register("password")}
                            placeholder='••••••••'
                            className={`w-full border ${
                                errors.password
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.password && (
                            <p className='text-red-600 text-sm mt-1'>
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type='submit'
                        disabled={loading || isSubmitting}
                        className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-60'>
                        {loading || isSubmitting ? "Signing in..." : "Login"}
                    </button>

                    {error && (
                        <p className='text-red-600 text-center text-sm mt-2'>
                            {error}
                        </p>
                    )}
                </form>

                <p className='text-center text-sm text-gray-500 mt-6'>
                    Don&apos;t have an account?{" "}
                    <Link
                        to='/register'
                        className='text-indigo-600 hover:text-indigo-500 font-medium'>
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
