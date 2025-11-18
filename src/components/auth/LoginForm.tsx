import { useEffect, useState } from "react"
import Asterisk from "../elements/Asterisk";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ImEye, ImEyeBlocked } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "../elements/Loading";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../stores";
import { clearError, loginUser, selectAuthLoading, selectIsAuthenticated } from "../../stores/slices/authSlice";

type FormDataType = {
    email: string;
    password: string;
}

export default function LoginForm() {
	const { register, formState, handleSubmit } = useForm<FormDataType>();

    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    const loading = useSelector((state: RootState) => selectAuthLoading(state));
    // const error = useSelector((state: RootState) => selectAuthError(state));
    const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));

    const handleSubmitLogin: SubmitHandler<FormDataType> = async function(data) {
		// Clear any previous Redux errors
        dispatch(clearError());

        // Dispatch login action
        const result = await dispatch(loginUser(data));
        // console.log(result, error)

        if (loginUser.fulfilled.match(result)) {
            return toast.success("Login successful");
        }
        
        if(result.type.includes("rejected")) {
            return toast.error(result?.payload || "Something went wrong!");
        }
	}

    // Redirect if already authenticated
    useEffect(function() {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);
    
    // Clear errors when component unmounts
    useEffect(function() {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    return (
        <form className="form" onSubmit={handleSubmit(handleSubmitLogin)}>

            {/* EMAIL INPUT */}
            <div className="form--item">
                <label htmlFor="email" className="form--label">Email address <Asterisk /></label>
                <input type="text" id="email" className="form--input" placeholder="example@email.com" {...register('email', {
                    required: 'Email is required',
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Email is invalid',
                    },
                    setValueAs: (value) => value.toLowerCase(),
                })} />
                <span className="form--error-message">
                    {formState.errors.email && formState.errors.email.message}
                </span>
            </div>

            {/* PASSWORD INPUT */}
            <div className="form--item">
                <div className="form--label-flex">
                    <label htmlFor="Password" className="form--label">
                        Password <Asterisk />
                    </label>

                    <Link to="" className="form--link">Forgot Password</Link>
                </div>

                <div className="form--input-box">
                    <input type={showPassword ? "text" : "password"} id="password" className="form--input" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" {...register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters',
                        },
                    })} />
                    <div className="form--input-icon" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <ImEye /> : <ImEyeBlocked />}
                    </div>
                </div>
                <span className="form--error-message">
                    {formState.errors.password && formState.errors.password.message}
                </span>
            </div>

            <button className="form--submit" type="submit">
                {loading ? <Loader color="#fff" /> : "Sign In"}
            </button>

            <span className="form--label">
                Don't have an account?{" "}
                <Link to="/signup" className="form--link">Sign Up</Link>
            </span>
        </form>
    )
}
