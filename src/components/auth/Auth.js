import React, { useState } from "react";
import * as Yup from "yup";

import './Auth.css';
import { login, signup } from "./AuthService";
import { Bounce, toast, ToastContainer } from "react-toastify";


/**
 * Component for user authentication
 */
function Auth() {
    // State variables
    const [isSignUp, setIsSignUp] = useState(true);
    const [isSignIn, setIsSignIn] = useState(false);
    const [error, setError] = useState({});
    const [isValid, setIsValid] = useState(false); // Track form validity

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
    });

    // Content for different scenarios
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

    // Form field details
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

    // Form validation schema
    const validationSchema = Yup.object({
        fullName: Yup.string().when("isSignUp", {
            is: true,
            then: Yup.string().required('Please enter your full name'),
        }),
        email: Yup.string().email('Invalid email').required('Please enter your email'),
        password: Yup.string().required('Please enter your password').min(6, 'Password must be at least 6 characters'),
    });

    /**
     * Handle change in form input fields
     * @param {Event} event - Event object
     */
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });

        // Revalidate the form on change
        validationSchema.validate(formData, { abortEarly: false, context: { isSignUp } })
            .then(() => setIsValid(true))
            .catch(() => setIsValid(false));
    };

    /**
     * Handle form submission
     * @param {Event} e - Event object
     */
    const submitForm = async (e) => {
        e.preventDefault();
        console.log('Form submitted successfully', formData);
        console.log('The signup value is:', isSignUp);
        console.log('The signin value is:', isSignIn);
        try {
            await validationSchema.validate(formData, { abortEarly: false, context: { isSignUp } });
            console.log('Form submitted successfully', formData);

            if (isSignUp) {
                console.log('Full Name:', formData.fullName);
                console.log('Email:', formData.email);
                console.log('Password:', formData.password);

                const emergencyData = {
                    age: 20,
                };

                const mergedData = {
                    ...formData, ...emergencyData
                };

                const response = await signup(mergedData);

                // if(response.message !==  "") {
                //     console.log('I am expecting th toastify to pop');
                //     toast.success(response.message, {
                //         position: "top-center",
                //         autoClose: 5000,
                //         hideProgressBar: false,
                //         closeOnClick: true,
                //         pauseOnHover: true,
                //         draggable: true,
                //         progress: undefined,
                //         theme: "dark",
                //         transition: Bounce,
                //     })
                // }

                console.log('The API response:', response.message);
                // toast.success(response.message);
            } else {
                console.log('Email:', formData.email);
                console.log('Password:', formData.password);

                const response = await login(formData);
                // toast.success(response.message, {
                //     position: "top-center",
                //     autoClose: 5000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     draggable: true,
                //     progress: undefined,
                //     theme: "dark",
                //     transition: Bounce,
                // })
                console.log('The API response:', response.message);
            }
        } catch (error) {
            if (error.inner) {
                // Handle Yup validation errors
                console.log('Validation errors:', error.inner);
                const newErrors = {};
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message;
                });
                setError(newErrors);
            } else {
                // Handle API errors (e.g., 501 status code or other API issues)
                console.error('API error:', error.message);
                // toast.error(error.message, {
                //     position: "top-center",
                //     autoClose: 5000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     draggable: true,
                //     progress: undefined,
                //     theme: "dark",
                //     transition: Bounce,
                // });
                setError({ api: error.message || 'Something went wrong with the API' });
            }
        }
    };

    /**
     * Toggle between sign up and sign in modes
     */
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

                <form onSubmit={submitForm} className={isSignUp ? "form-container signup" : "form-container signin"}>
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

                    <button type="submit" className={isValid ? "btn-filled isEnabled" : "btn-filled isDisabled"}>
                        {isSignUp ? form_field[0].button : form_field[1].button}
                    </button>
                </form>
            </div>
        </div>
        <ToastContainer />
        </div>
    );
}


export default Auth;
