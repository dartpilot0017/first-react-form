import React, { useCallback } from "react";

import './Auth.css';

function Auth() {
    const [isSignUp, setIsSignUp] = React.useState(true);
    const [isSignIn, setIsSignIn] = React.useState(false);
    const [fullName, setFullName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState({
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
            instruction: 'Enter your informations to get started',
            button: 'Sign Up',
        },
        {
            title: 'Sign In',
            instruction: 'Enter your informations to get started',
            button: 'Sign In',
        },
    ]

    const toggleButton = () => {
        setIsSignUp((prevIsSignUp) => !prevIsSignUp);
        setIsSignIn((prevIsSignIn) => !prevIsSignIn);
        setError({fullName: '', email: '', password: ''});
        console.log('The signup value is:', isSignUp);
        console.log('The signin value is:', isSignIn);
    };

    const validateForm = useCallback(() => {
        let isValid = true;
        if (isSignUp) {
            isValid = isValid && fullName.length !== 0;
            isValid = isValid && email.length !== 0;
            isValid = isValid && password.length >= 5;
        } else {
            isValid = isValid && email.length !== 0;
            isValid = isValid && password.length >= 5;
        }
        return isValid;
    }, [isSignUp, fullName, email, password]);



    const submitForm = () => {
        const newErrors = {
            fullName: '',
            email: '',
            password: '',
        };
    
        if (isSignUp) {
            if (!fullName) {
                newErrors.fullName = 'Please enter your full name';
            }
            if (!email) {
                newErrors.email = 'Please enter your email';
            }
            if (!password) {
                newErrors.password = 'Please enter your password';
            }
        } else {
            if (!email) {
                newErrors.email = 'Please enter a registered email';
            }
            if (!password) {
                newErrors.password = 'Please enter a valid password';
            }
        }
    
        setError(newErrors);
    
        // Only submit the form if there are no errors
        if (!Object.values(newErrors).some(error => error)) {
            if (isSignUp) {
                console.log('Form submitted:', { fullName, email, password });
            } else {
                console.log('Form submitted:', { email, password });
            }
        }
    };
    


    

    // const newErrors = {
    //     fullName: '',
    //     email: '',
    //     password: '',
    // };
    // if(isSignUp) {
    //     if(!fullName) {
    //         newErrors.fullName = 'Please enter your full name';
    //     }
    //     if(!email) {
    //         newErrors.email = 'Please enter your email';
    //     }
    //     if(!password) {
    //         newErrors.password = 'Please enter your password';
    //     }
    // } else {
    //     if(!email) {
    //         newErrors.email = 'Please enter a registered email';
    //     }
    //     if(!password) {
    //         newErrors.password = 'Please enter a valid password';
    //     }
    // }
    // setError(newErrors);
    // return !Object.values(newErrors).some(error => error);

    return (
        <div className="auth-class mx-auto">
            <div className="card">
                <div className={isSignUp ? "content signup" : "content signin"}>
                    <h1>
                        {isSignUp ? content[0].greeting : content[1].greeting}
                    </h1>
                    <p>
                        {isSignUp ? content[0].description : content[1].description}
                    </p>
                    <button className="btn-outlined" onClick={toggleButton}>
                        {isSignUp ? content[0].button : content[1].button}
                    </button>
                </div>
                <div className={isSignUp ? "form-container signup" : "form-container signin"}>
                    <div className="form-header">
                        <h1>{!isSignUp ? form_field[0].title : form_field[1].title}</h1>
                        <p>{!isSignUp ? form_field[0].instruction : form_field[1].instruction}</p>
                    </div>

                    <div className="form-body">
                        {isSignUp && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                                {!error.fullName && <span className="error-message">{error.fullName}</span>}
                            </>
                        )}
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <button className={!validateForm() ? "btn-filled isDisabled" : "btn-filled isEnabled"} onClick={submitForm} disabled={!validateForm()}>
                        {!isSignUp ? form_field[0].button : form_field[1].button}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Auth;