import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import AdminDashboard from "../pages/AdminDashboard";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import RequireAuth from "./RequireAuth";
import Register from "../pages/Register";

export default function AppRouter() {
    return (
        <Layout>
            <Routes>
                <Route path='/' element={<Navigate to='/login' />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route
                    path='/dashboard'
                    element={
                        <RequireAuth allowedRoles={["user"]}>
                            <Dashboard />
                        </RequireAuth>
                    }
                />

                <Route
                    path='/dashboard'
                    element={
                        <RequireAuth allowedRoles={["admin"]}>
                            <AdminDashboard />
                        </RequireAuth>
                    }
                />

                <Route path='*' element={<Navigate to='/' />} />
            </Routes>
        </Layout>
    );
}
