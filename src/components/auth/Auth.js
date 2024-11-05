import React, { useState } from "react";
import * as Yup from "yup";

import './Auth.css';
import { login, signup } from "./AuthService";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles

function Auth() {
    const [isSignUp, setIsSignUp] = useState(true);
    const [isSignIn, setIsSignIn] = useState(false);
    const [error, setError] = useState({});
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
    });

    const content = [
        {
            greeting: "Hello Friend!",
            description: "Register with your personal details to get started",
            button: "Sign Up"
        },
        {
            greeting: "Welcome Back!",
            description: "Sign in with your credentials to get started",
            button: "Sign In"
        }
    ];

    const form_field = [
        {
            title: 'Create Account',
            instruction: 'Enter your information to get started',
            button: 'Sign Up',
        },
        {
            title: 'Sign In',
            instruction: 'Enter your information to get started',
            button: 'Sign In',
        }
    ];

    const validationSchema = Yup.object({
        fullName: Yup.string().when("isSignUp", {
            is: true,
            then: Yup.string().required('Please enter your full name'),
        }),
        email: Yup.string().email('Invalid email').required('Please enter your email'),
        password: Yup.string().required('Please enter your password').min(6, 'Password must be at least 6 characters'),
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });

        validationSchema.validate(formData, { abortEarly: false, context: { isSignUp } })
            .then(() => setIsValid(true))
            .catch(() => setIsValid(false));
    };

    const submitForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await validationSchema.validate(formData, { abortEarly: false, context: { isSignUp } });

            if (isSignUp) {
                const emergencyData = { age: 20 };
                const mergedData = { ...formData, ...emergencyData };
                const response = await signup(mergedData);

                toast.success(response.message, { transition: Bounce });
            } else {
                const response = await login(formData);
                toast.success(response.message, { transition: Bounce });
            }
        } catch (error) {
            if (error.inner) {
                const newErrors = {};
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message;
                });
                setError(newErrors);

                // toast.error("Please fix the highlighted errors", { transition: Bounce });
                toast.error("Please fix the highlighted errors", { transition: Bounce });
            } else {
                console.error('API error:', error.message);
                setError({ api: error.message || 'Something went wrong with the API' });
                toast.error(error.message, { transition: Bounce });
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleButton = () => {
        setIsSignUp(prevIsSignUp => !prevIsSignUp);
        setIsSignIn(prevIsSignIn => !prevIsSignIn);
        setError({});
    };

    return (
        <div>
            <div className="auth-class mx-auto">
            <div className="card">
                <div className={isSignUp ? "content signup" : "content signin"}>
                    <h1>{!isSignUp ? content[0].greeting : content[1].greeting}</h1>
                    <p>{!isSignUp ? content[0].description : content[1].description}</p>
                    <button className="btn-outlined" onClick={toggleButton}>
                        {!isSignUp ? content[0].button : content[1].button}
                    </button>
                </div>

                <form onSubmit={ !loading ? submitForm : null } className={isSignUp ? "form-container signup" : "form-container signin"}>
                    <div className="form-header">
                        <h1>{isSignUp ? form_field[0].title : form_field[1].title}</h1>
                        <p>{isSignUp ? form_field[0].instruction : form_field[1].instruction}</p>
                    </div>

                    <div className="form-body">
                        {isSignUp && (
                            <div className="input-field">
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                                {error.fullName && <span className="error-message">{error.fullName}</span>}
                            </div>
                        )}
                        <div className="input-field">
                            <input
                                type="email"
                                placeholder="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {error.email && <span className="error-message">{error.email}</span>}
                        </div>

                        <div className="input-field">
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {error.password && <span className="error-message">{error.password}</span>}
                        </div>
                    </div>

                    <button
                            type="submit"
                            className={ !loading ? "btn-filled isEnabled" : "btn-filled isDisabled"}
                            disabled={!isValid || loading} // Disable button if loading or form is invalid
                        >
                            {loading ? "Processing..." : (isSignUp ? form_field[0].button : form_field[1].button)}
                        </button>
                </form>
            </div>
        </div>
        <ToastContainer />
        </div>
    );
}

export default Auth;
