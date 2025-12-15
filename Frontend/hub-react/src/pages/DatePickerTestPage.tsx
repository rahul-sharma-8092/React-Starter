import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { DatePicker } from "../components/DatePicker";

const schema = z.object({
    dob: z.date({ message: "Date of birth is required" }),
});

type FormData = z.infer<typeof schema>;

export default function DatePickerTestPage() {
    // Example with Object State
    const [dateRange, setDateRange] = React.useState<{
        fromDate: Date | undefined;
        toDate: Date | undefined;
    }>({
        fromDate: new Date(),
        toDate: undefined,
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: FormData) => {
        alert(`Form Submitted: ${data.dob.toDateString()}`);
    };

    const handleFromDateChange = (date: Date | undefined) => {
        setDateRange((prev) => ({
            ...prev,
            fromDate: date,
        }));
    };

    return (
        <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center p-10  gap-10'>
            {/* Object State Example */}
            <div className='w-full max-w-sm'>
                <h2 className='text-xl font-bold mb-4 '>
                    Object State (fromDate)
                </h2>
                <DatePicker
                    value={dateRange.fromDate}
                    onChange={handleFromDateChange}
                    label='Pick Start Date'
                />
                <div className='mt-2 text-gray-600 text-sm'>
                    Selected:{" "}
                    {dateRange.fromDate
                        ? dateRange.fromDate.toDateString()
                        : "None"}
                </div>
                <div className='mt-1 text-xs text-gray-500'>
                    Full State: {JSON.stringify(dateRange)}
                </div>
            </div>

            {/* React Hook Form Example */}
            <div className='w-full max-w-sm border-t pt-8'>
                <h2 className='text-xl font-bold mb-4 '>
                    React Hook Form + Zod
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    <Controller
                        control={control}
                        name='dob'
                        render={({ field }) => (
                            <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                                label='Date of Birth'
                            />
                        )}
                    />
                    {errors.dob && (
                        <p className='text-red-500 text-sm'>
                            {errors.dob.message}
                        </p>
                    )}
                    <button
                        type='submit'
                        className='w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition'>
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
