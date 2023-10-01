import { act, fireEvent, render, screen } from '@testing-library/react';
import DownDrop from '../components/DownDrop';
import { MenuProps } from 'antd';


test('Show dropdown when clicked', () => {
    const items: MenuProps["items"] = [
        {
          key: '1',
          label: <p>test 1</p>
        },
        {
            key: '2',
            label: <p>test 2</p>
        },
        {
            key: '3',
            label: <p>test 3</p>
        },
      ];
    const {getByRole} = render(<DownDrop items={items} text={'Test-dropdown'}/>);
    const dropDownText = getByRole("button");
    act(() => {
        fireEvent.click(dropDownText);
    });
    const text = screen.getByText("test 1");
    expect(text).toBeInTheDocument();
})
