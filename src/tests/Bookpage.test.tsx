import { act, fireEvent, render, screen } from '@testing-library/react';
import BookPage from '../pages/BookPage';


test('feedback if not logged in when rating books', () => {
    const {getByRole} = render(<BookPage/>);
    const rateButton = getByRole("button", {name: "Rate this book"});
    act(() => {
        fireEvent.click(rateButton);
    })
    const feedback = screen.getByText("You need to be logged in to rate books");
    expect(feedback).toBeInTheDocument();
})