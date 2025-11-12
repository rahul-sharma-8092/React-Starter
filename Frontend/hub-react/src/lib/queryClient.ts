import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // throwOnError: true,
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 5000 * 60, // 1 min
        },
    },
});
