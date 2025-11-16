import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className='min-h-[70vh] w-full flex items-center justify-center bg-gray-50 animate-[fadeIn_0.4s_ease-out] relative overflow-hidden'>
            <div className='flex flex-col items-center text-center'>
                <div className='relative flex items-center justify-center mb-10'>
                    <div className='w-36 h-36 rounded-full border-4 border-transparent border-t-indigo-500 animate-[spinSlow_2.2s_linear_infinite]' />

                    <div className='absolute w-24 h-24 rounded-full border-4 border-transparent border-t-pink-400 animate-[spinReverse_1.8s_linear_infinite]' />

                    <div className='absolute w-4 h-4 bg-black rounded-full animate-ping' />
                </div>

                <h1 className='text-7xl font-bold text-black drop-shadow-lg tracking-wide'>
                    404
                </h1>

                <p className='text-black text-xl mt-4 max-w-xl'>
                    The page you&apos;re looking for doesn&apos;t exist or may
                    have been moved.
                </p>

                <Link
                    to='/'
                    className='mt-8 px-8 py-3 rounded-full bg-black border hover:border-black border-black/20 text-white backdrop-blur transition-all duration-300 hover:bg-white/20 hover:text-black'>
                    Go Back Home
                </Link>
            </div>
        </div>
    );
}
