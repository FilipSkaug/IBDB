import { act, fireEvent, render, getByRole, getByText, screen } from '@testing-library/react';
import LoginPopup from '../components/LoginPopup';
import { SetStateAction } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseControl';
import { FirebaseError } from 'firebase/app';

test('renders loginPopup', async () => {
    render(<LoginPopup visible={true} setVisible={jest.fn()} />);
    const popUpElement = screen.getByText(/Log in with Google/i);
    expect(popUpElement).toBeInTheDocument();
})

test('test error if invalid email', async () => {
    try {
        var errorMessage: string = "";
        await signInWithEmailAndPassword(auth, "invalid-email", "password");
    } catch (error) {
        errorMessage = (error as FirebaseError).message;
    }
    expect(errorMessage).toBeTruthy;
})