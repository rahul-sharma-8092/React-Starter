export default function LoadingOverlay() {
    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[0px] animate-[fadeIn_0.3s_ease-out]'>
            <div className='relative flex items-center justify-center'>
                {/* Outer Ring */}
                <div className='w-24 h-24 rounded-full border-4 border-transparent border-t-indigo-500 animate-[spinSlow_1.5s_linear_infinite]'></div>

                {/* Middle Ring */}
                <div className='absolute w-16 h-16 rounded-full border-4 border-transparent border-t-pink-500 animate-[spinReverse_1.2s_linear_infinite]'></div>

                {/* Inner Dot */}
                <div className='absolute w-3 h-3 rounded-full bg-white animate-ping'></div>
            </div>
        </div>
    );
}
