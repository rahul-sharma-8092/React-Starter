import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

export const useLoggedInUser = () => {
    const loggedInUser = useSelector((state: RootState) => state.auth);

    if (!loggedInUser) return null;
    return loggedInUser.user;
};
