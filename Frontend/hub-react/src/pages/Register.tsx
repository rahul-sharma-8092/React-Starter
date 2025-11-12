import { toast } from "react-toastify";
import api from "../services/axiosInstance";
import type { UserRegisterDto } from "../types/auth";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { registerSchema } from "../validations/auth/registerSchema";
import type { AxiosError } from "axios";
import { allowNumericInput } from "../lib/helperUtilities";
import { indianCities, indianState } from "../data/dropdown";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Register() {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<UserRegisterDto>({
        resolver: zodResolver(registerSchema),
        defaultValues: { state: "", role: 2, termsConditions: true },
    });

    const selectedState = watch("state");

    // Filter cities based on selected state
    const filteredCities = indianCities.filter(
        (c) =>
            c.state === indianState.find((s) => s.name === selectedState)?.code
    );

    useEffect(() => {
        setValue("city", "");
    }, [selectedState, setValue]);

    const onSubmit = async (data: UserRegisterDto) => {
        try {
            const res = await api.post("/auth/register", data);
            console.log("Register response: ", res.data);

            if (res.data?.success === true) {
                toast.success(res.data?.message);

                localStorage.setItem(
                    "plan_verifyAuth",
                    JSON.stringify(res.data?.data)
                );
                // router.replace("/auth/verify-otp");
            }
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-3 max-w-xl mx-auto'>
            {/* Name */}
            <div className='w-full'>
                <input
                    {...register("fullName")}
                    placeholder='Full Name*'
                    className='w-full rounded-lg border p-2'
                    tabIndex={1}
                    autoFocus
                />
                {errors.fullName && (
                    <p className='error-text'>{errors.fullName.message}</p>
                )}
            </div>

            <div className='w-full'>
                <select
                    {...register("role")}
                    className='w-full rounded-lg border p-2'
                    tabIndex={5}>
                    <option value='1'>Admin</option>
                    <option value='2'>User</option>
                </select>
                {errors.role && (
                    <p className='error-text'>{errors.role.message}</p>
                )}
            </div>

            {/* Email + Mobile */}
            <div className='flex flex-col gap-3 md:flex-row'>
                <div className='w-full'>
                    <input
                        {...register("email")}
                        placeholder='Email*'
                        className='w-full rounded-lg border p-2'
                        inputMode='email'
                        tabIndex={2}
                    />
                    {errors.email && (
                        <p className='error-text'>{errors.email.message}</p>
                    )}
                </div>
                <div className='w-full'>
                    <input
                        {...register("mobileNumber")}
                        placeholder='Mobile*'
                        className='w-full rounded-lg border p-2'
                        maxLength={10}
                        inputMode='tel'
                        onInput={allowNumericInput}
                        tabIndex={3}
                    />
                    {errors.mobileNumber && (
                        <p className='error-text'>
                            {errors.mobileNumber.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Address */}
            <div className='w-full'>
                <input
                    {...register("address")}
                    placeholder='Address*'
                    className='w-full rounded-lg border p-2'
                    tabIndex={4}
                />
                {errors.address && (
                    <p className='error-text'>{errors.address.message}</p>
                )}
            </div>

            {/* City + State */}
            <div className='flex flex-col gap-3 md:flex-row'>
                <div className='w-full'>
                    <select
                        {...register("city")}
                        className='w-full rounded-lg border p-2'
                        tabIndex={5}>
                        <option value=''>Select city</option>
                        {filteredCities.map((c) => (
                            <option key={c.id} value={c.name}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                    {errors.city && (
                        <p className='error-text'>{errors.city.message}</p>
                    )}
                </div>
                <div className='w-full'>
                    <select
                        {...register("state")}
                        className='w-full rounded-lg border p-2'
                        tabIndex={6}>
                        <option value=''>Select state</option>
                        {indianState.map((s) => (
                            <option key={s.id} value={s.name}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                    {errors.state && (
                        <p className='error-text'>{errors.state.message}</p>
                    )}
                </div>
            </div>

            {/* Password + Confirm */}
            <div className='flex flex-col gap-3 md:flex-row'>
                <div className='w-full'>
                    <input
                        {...register("password")}
                        type='password'
                        placeholder='Password*'
                        tabIndex={6}
                        className='w-full rounded-lg border p-2'
                    />
                    {errors.password && (
                        <p className='error-text'>{errors.password.message}</p>
                    )}
                </div>
                <div className='w-full'>
                    <input
                        {...register("confirmPassword")}
                        type='password'
                        placeholder='Confirm Password*'
                        tabIndex={7}
                        className='w-full rounded-lg border p-2'
                    />
                    {errors.confirmPassword && (
                        <p className='error-text'>
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Terms */}
            <div className='w-full'>
                <div className='flex items-center gap-3'>
                    <input
                        type='checkbox'
                        {...register("termsConditions")}
                        id='termsConditions'
                        tabIndex={8}
                    />
                    <label
                        htmlFor='termsConditions'
                        className='cursor-pointer select-none'>
                        I agree to the Terms & Conditions
                    </label>
                </div>
                {errors["termsConditions"] && (
                    <p className='error-text'>
                        {errors["termsConditions"].message}
                    </p>
                )}
            </div>

            {/* Submit */}
            <button
                type='submit'
                disabled={isSubmitting}
                tabIndex={9}
                className='bg-blue-600 px-5 py-2 rounded-md mx-auto block'>
                {isSubmitting ? "Registering..." : "Register"}
            </button>
        </form>
    );
}
