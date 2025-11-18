import { useState } from "react"
import Asterisk from "../elements/Asterisk";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { ImEye, ImEyeBlocked } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "../elements/Loading";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../stores";
import { registerUser, clearError, selectAuthLoading } from '../../stores/slices/authSlice';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'


type FormDataType = {
    name: string;
    email: string;
    phone: string;
    password: string;
}

export default function SignupForm() {
    const { register, formState, handleSubmit, control } = useForm<FormDataType>();
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    const loading = useSelector((state: RootState) => selectAuthLoading(state));
    // const error = useSelector((state: RootState) => selectAuthError(state));


    const handleSubmitSignup: SubmitHandler<FormDataType> = async function(data) {
        // Clear any previous Redux errors
        dispatch(clearError());

        // Dispatch login action
        const result = await dispatch(registerUser(data));
        // console.log(result, error)

        if (registerUser.fulfilled.match(result)) {
            setTimeout(() => navigate('/login'), 1000);
            return toast.success("Signup successful");
        }
        
        if(result.type.includes("rejected")) {
            return toast.error(result?.payload || "Something went wrong!");
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit(handleSubmitSignup)}>

            {/* NAME INPUT */}
            <div className="form--item">
                <label htmlFor="name" className="form--label">Name <Asterisk /></label>
                <input type="text" id="name" className="form--input" placeholder="Your Name" {...register('name', {
                    required: 'Name is required',
                })} />
                <span className="form--error-message">
                    {formState.errors.name && formState.errors.name.message}
                </span>
            </div>

            {/* EMAIL INPUT */}
            <div className="form--item">
                <label htmlFor="email" className="form--label">Email address <Asterisk /></label>
                <input type="text" id="email" className="form--input" placeholder="example@email.com" {...register('email', {
                    required: 'Email is required',
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Email is invalid',
                    },
                })} />
                <span className="form--error-message">
                    {formState.errors.email && formState.errors.email.message}
                </span>
            </div>

            {/* PHONE INPUT */}
            <div className="form--item">
                <label htmlFor="phone" className="form--label">Phone Number <Asterisk /></label>

                <Controller
                    name="phone"
                    control={control}
                    rules={{
                        required: 'Phone number is required',
                        minLength: {
                            value: 13,
                            message: 'Phone number must be up to 11 digits',
                        },
                    }}
                    render={({ field }) => (
                        <PhoneInput
                            {...field}
                            country={'ng'}
                            onlyCountries={['ng', 'gh', 'za']}
                            placeholder="Your phone number"
                            inputClass='phone-input'
                            buttonClass="phone-input-button"
                            dropdownClass="phone-input-dropdown"
                            inputProps={{ id: 'phone' }}
                        />
                    )}
                />
                <span className="form--error-message">
                    {formState.errors.phone && formState.errors.phone.message}
                </span>
            </div>

            {/* PASSWORD INPUT */}
            <div className="form--item">
                <label htmlFor="Password" className="form--label">
                    Password <Asterisk />
                </label>

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
                {loading ? <Loader color="#fff" /> : "Sign Up"}
            </button>

            <span className="form--label">
                Already have an account?{" "}
                <Link to="/login" className="form--link">Login</Link>
            </span>
        </form>
    )
}
