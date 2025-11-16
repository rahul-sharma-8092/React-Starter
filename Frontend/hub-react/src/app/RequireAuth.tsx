import { Navigate } from "react-router-dom";
import Unauthorized from "../pages/Unauthorized";
import { useLoggedInUser } from "../hooks/useLoggedInUser";

interface propRequireAuth {
    children: React.ReactNode;
    allowedRoles?: string[];
}

function RequireAuth({ children, allowedRoles }: propRequireAuth) {
    const loggedInUser = useLoggedInUser();

    if (!loggedInUser) {
        return <Navigate to='/login' replace />;
    }

    if (
        allowedRoles &&
        !allowedRoles.includes(loggedInUser.role?.toLocaleLowerCase() ?? "")
    ) {
        return <Unauthorized />;
    }

    return <>{children}</>;
}

export default RequireAuth;
