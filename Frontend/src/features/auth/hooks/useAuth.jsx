import {login, register, getMe, logout} from "../services/auth.api"
import {useContext} from "react"
import { AuthContext } from "../auth.context"
import toast from "react-hot-toast"

export const useAuth = () => {
    const context = useContext(AuthContext)
    const {user, setUser, loading, setLoading} = context

    async function handleRegister({username, email, password}) {
        try {
            setLoading(true)
            const data = await register({username, email, password})
            setUser(data.user)
            toast.success("Registration successful!")
            return true
        } catch (error) {
            console.error("Register Error:", error);
            const message = error.response?.data?.message || "Failed to register. Please try again."
            toast.error(message)
            return false
        } finally {
            setLoading(false)
        }
    }

    async function handleLogin({username, email, password}) {
        try {
            setLoading(true)
            const data = await login({username, email, password})
            setUser(data.user)
            toast.success("Successfully logged in!")
            return true
        } catch (error) {
            console.error("Login Error:", error);
            const message = error.response?.data?.message || "Invalid credentials. Please try again."
            toast.error(message)
            return false
        } finally {
            setLoading(false)
        }
    }

    async function handleGetMe() {
        try {
            setLoading(true)
            const data = await getMe()
            setUser(data.user)
        } catch (error) {
            console.error("GetMe Error:", error);
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    async function handleLogout() {
        try {
            setLoading(true)
            await logout()
            setUser(null)
            toast.success("Successfully logged out!")
            return true
        } catch (error) {
            console.error("Logout Error:", error);
            toast.error("Failed to log out.")
            return false
        } finally {
            setLoading(false)
        }
    }

    return {
        user, loading, handleRegister, handleLogin, handleLogout, handleGetMe
    }
}