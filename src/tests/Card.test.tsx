import { act, fireEvent, render } from '@testing-library/react';
import Card from '../components/Card';
import { BrowserRouter as Router } from 'react-router-dom';

test('navigate to correct bookpage when clicked', () => {
    const {getByRole} = render(<Router><Card title={'Spare'} bookIMG={'https://upload.wikimedia.org/wikipedia/en/6/69/Spare_cover.jpg'} id={'4'}/></Router>);
    const cardImg = getByRole("img");
    act(() => {
        fireEvent.click(cardImg);
    })
    const pathName = window.location.pathname;
    expect(pathName).toBe("/bookPage/4");
})