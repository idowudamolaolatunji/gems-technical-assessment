import ErrorPage from "./pages/ErrorPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
import HomePage from "./pages/HomePage";


export default function App() {
	return (
		<BrowserRouter>
			<Routes>
                {/* UNPROTECTED ROUTES */}
				<Route path="*" element={<ErrorPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignUpPage />} />
                
                {/* PROTECTED ROUTES */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<HomePage />}></Route>
                    <Route path="/" element={<Navigate to="/dashboard" />}></Route>
                </Route>
			</Routes>
		</BrowserRouter>
	);
}
