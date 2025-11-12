import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { Navigate } from "react-router-dom";

interface propRequireAuth {
    children: React.ReactNode;
    allowedRoles?: string[];
}

function RequireAuth({ children, allowedRoles }: propRequireAuth) {
    const loggedInUser = useSelector((state: RootState) => state.auth);

    if (!loggedInUser || !loggedInUser.user) {
        return <Navigate to='/login' replace />;
    }

    if (
        allowedRoles &&
        !allowedRoles.includes(
            loggedInUser.user?.role?.toLocaleLowerCase() ?? ""
        )
    ) {
        return <Navigate to='/unauthorized' replace />;
    }

    return <>{children}</>;
}

export default RequireAuth;
