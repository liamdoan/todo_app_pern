import { render, screen, fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { setupAxiosMocks } from './testUtils';
import axios from 'axios';
import App from '../../App';
import { mockTodos } from './testUtils';
import '@testing-library/jest-dom/extend-expect';

describe('Add a new task', () => {
    beforeEach(() => setupAxiosMocks());

    test('add new task and show it on the list', async () => {
        axios.get.mockImplementation(() => Promise.resolve({data: mockTodos}));
        axios.post.mockImplementation(() => Promise.resolve({
            data: {
                task: 'new task 1', 
                description: 'new description 1'
            }}
        ));

        render(<App />);

        // arrange input elem
        const taskInput = screen.getByPlaceholderText(/Task/i);
        const descInput = screen.getByPlaceholderText(/Description/i);
        const submitBtn = screen.getByRole('button', {name : /add task button/i}); // use aria-label and ARIA role to pass custom role

        // act of user typing to input
        fireEvent.change(taskInput, {target: {value: 'new task 1'}});
        fireEvent.change(descInput, {target: {value: 'new description 1'}});
        fireEvent.click(submitBtn);

        // assert the render of new task
        await waitFor(() => {
            expect(screen.getByText('new task 1')).toBeInTheDocument();
            expect(screen.getByText('new description 1')).toBeInTheDocument();
        })
    });
});
