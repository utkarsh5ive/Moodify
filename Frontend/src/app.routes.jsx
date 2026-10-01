import {createBrowserRouter} from "react-router"
import Register from "./features/auth/pages/Register"
import Login from "./features/auth/pages/Login"
import Home from "./features/home/pages/Home"
import ProtectedRoute from "./features/shared/components/ProtectedRoute"

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>
        )
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    }
])