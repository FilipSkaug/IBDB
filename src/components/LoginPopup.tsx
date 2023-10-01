import { Dispatch, MouseEventHandler, SetStateAction, useState } from 'react';
import '../styles/LoginPopup.css';
import { AuthError, AuthErrorCodes, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseControl';

const LoginPopup = ({ visible, setVisible }: { visible: boolean; setVisible: Dispatch<SetStateAction<boolean>> }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [logInOrSignup, setLogInOrSignup] = useState('logIn');
    const [errorMessage, setErrorMessage] = useState('');

    const close = () => {
        setVisible(false);
        setEmail('');
        setPassword('');
        setErrorMessage('');
    }

    const closeOrOpen: MouseEventHandler<HTMLDivElement> = (e) => {
        const isClose = (e.target as HTMLElement).closest("#popup")
        if (!isClose) {
            close();
            setLogInOrSignup('logIn');
        }
    }

    // Logs in the mail and password set
    const logIn = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                localStorage.setItem('user', JSON.stringify(userCredentials.user.email));
                close();
            }).catch((error) => {
                console.log(error);
                showError(error);
            });
    }
    // Opens popup to sign in with google
    const googleLogIn = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        signInWithPopup(auth, googleProvider)
            .then((userCredentials) => {
                localStorage.setItem('user', JSON.stringify(userCredentials.user.email));
                close();
            });
    }

    // Sets error message corresponding to the error
    const showError = (error: AuthError) => {
        if (error.code === 'auth/invalid-email') {
            setErrorMessage('Invalid Email')
        } else if (error.code === 'auth/user-not-found') {
            setErrorMessage('No user with this email');
        } else if (error.code === AuthErrorCodes.INVALID_PASSWORD) {
            setErrorMessage('Wrong password, try again');
        } else if (error.code === 'auth/too-many-requests') {
            setErrorMessage('Access to this account has been temporarily disabled due to many failed login attempts');
        } else if (error.code === 'auth/weak-password') {
            setErrorMessage('Password should be at least 6 characters');
        } else {
            setErrorMessage('Error, try again later');
        }
    }

    // Creates new user and checks for error
    const signUp = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (password === confirmPassword) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredentials) => {
                    localStorage.setItem('user', JSON.stringify(userCredentials.user.email));
                    close();
                }).catch((error) => {
                    console.log(error);
                    showError(error);
                });
        } else {
            setErrorMessage("Passwords do not match");
        }
    }

    function handleEnterLogIn(event: React.KeyboardEvent<HTMLInputElement>): void {
        if (event.key === 'Enter') {
          logIn(event); // calling the same function that is called when the "Log in" button is clicked
        }
      }

    function handleEnterSignUp(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter') {
        signUp(event); // calling the same function that is called when the "Sign Up" button is clicked
    }
    }

    return (
        <div>
            {visible ?
                <div className="popupBackground" onClick={closeOrOpen}>
                    <div className="login-inner" id="popup">
                        <div className="top">

                            <div className='logIn-signUp-flex'>
                                <button className={logInOrSignup === 'logIn' ? 'normal' : 'grey-text'} onClick={() => setLogInOrSignup('logIn')}> Log in </button>
                                <div className={logInOrSignup === 'logIn' ? 'logIn-underline' : ''}></div>
                            </div>
                                <div className='logIn-signUp-flex'>
                                    <button className={logInOrSignup === 'signUp' ? 'normal' : 'grey-text'} onClick={() => setLogInOrSignup('signUp')}> Sign up </button>
                                    <div className={logInOrSignup === 'signUp' ? 'signUp-underline' : ''}></div>
                                </div>
                        </div>
                        <div>
                            <p>Email</p>
                            <input className="input shadow-0" id="email" type="text" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                        </div>
                        <div>
                            <p>Password</p>
                            <input className="input shadow-0" id="password" type="password" placeholder="Password" onKeyDown={handleEnterLogIn} value={password} onChange={(e) => { setPassword(e.target.value) }} />
                        </div>
                        {logInOrSignup === 'logIn' ?
                            <div>
                                {errorMessage !== '' ?
                                    <p className='error'>{errorMessage}</p>
                                    : null}
                                <div className="logIn-buttons">
                                    <button className="popup-button shadow-0" onClick={logIn}>
                                        Log in
                                    </button>
                                    <button className="google-button shadow-0" onClick={googleLogIn}>
                                        Log in with Google
                                        <img className="google-icon" src="https://freesvg.org/img/1534129544.png" alt="google-icon"/>
                                    </button>
                                </div>
                            </div>
                            : <div>
                                <input className="input shadow-0" id="confirmPassword" type="password" placeholder="Confirm Password" onKeyDown={handleEnterSignUp} value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} />
                                {errorMessage !== '' ?
                                    <p className='error'>{errorMessage}</p>
                                    : null}
                                <div className="logIn-buttons">
                                    <button className="popup-button shadow-0" onClick={signUp}>
                                        Sign up
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                </div> : null}
        </div>
    )

}

export default LoginPopup;