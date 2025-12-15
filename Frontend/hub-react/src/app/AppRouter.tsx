import { Navigate, Route, Routes } from "react-router-dom";
import { useAppSelector } from "../hooks/hooks";
import Layout from "../components/Layout";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import Login from "../pages/Login";
import RequireAuth from "./RequireAuth";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import VerifyEmail from "../pages/VerifyEmail";
import DashBoardRedirection from "../components/DashBoardRedirection";
import { useAppDispatch } from "../hooks/hooks";
import { loadPersistedAuth } from "../redux/features/auth/authSlice";
import { useEffect } from "react";
import DatePickerTestPage from "../pages/DatePickerTestPage";
import SingleSelectTestPage from "../pages/SingleSelectTestPage";
import MultiSelectTestPage from "../pages/MultiSelectTestPage";
import TodoGridPage from "../pages/TodoGridPage";

export default function AppRouter() {
    const isLoading = useAppSelector((state) => state.loading.global);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loadPersistedAuth());
    }, []);

    return (
        <Layout>
            {isLoading && <LoadingOverlay />}
            <Routes>
                <Route path='/datepicker' element={<DatePickerTestPage />} />
                <Route path='/select-demo' element={<SingleSelectTestPage />} />
                <Route path='/multi-select-demo' element={<MultiSelectTestPage />} />
                <Route path='/todos' element={<TodoGridPage />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/verify-email/:id' element={<VerifyEmail />} />
                <Route
                    path='/dashboard'
                    element={
                        <RequireAuth allowedRoles={["user", "admin"]}>
                            <DashBoardRedirection />
                        </RequireAuth>
                    }
                />

                <Route path='/' element={<Navigate to='/login' />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
        </Layout>
    );
}
