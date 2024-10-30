import { render, screen, fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { setupAxiosMocks } from './testUtils';
import axios from 'axios';
import App from '../../App';
import { mockTodos } from './testUtils';
import '@testing-library/jest-dom/extend-expect';

describe("Edit a task", () => {
    beforeEach(() => setupAxiosMocks());

    test('edit a task and show updated data on the list', async () => {
        axios.get.mockImplementation(() => Promise.resolve({data: mockTodos}));
        // axios mock should have similar response data structure, similar to what expected in request function
        axios.put.mockImplementation(() => Promise.resolve({
            data: {
                updatedTodo: {
                    task: 'go training - update 1',
                    description: 'Go for daily schedule training at 9.30PM - update 1',
                },
            }},
        ));

        render(<App/>);

        // ensure there are existing tasks to edit
        await waitFor(() => {
            expect(screen.getByText(/Go training/i)).toBeInTheDocument();
            expect(screen.getByText(/Go for daily schedule training at 9.30PM/i)).toBeInTheDocument();
        })

        const editBtn = screen.getByTestId(`edit-btn-${mockTodos[0]._id}`);
        fireEvent.click(editBtn);

        const taskInput = screen.getByDisplayValue(/go training/i);
        const descInput = screen.getByDisplayValue(/Go for daily schedule training at 9.30PM/i);
        //ensure the input is prefilled with existing task and description
        await waitFor(() => {
            expect(taskInput).toBeInTheDocument();
            expect(descInput).toBeInTheDocument();
        });

        fireEvent.change(taskInput, {target: {value: 'go training - update 1'}});
        fireEvent.change(descInput, {target: {value: 'Go for daily schedule training at 9.30PM - update 1'}});

        const submitEditBtn = screen.getByRole('button', {name: /submit edit task button/i});
        fireEvent.click(submitEditBtn);

        await waitFor(() => {
            expect(screen.getByText(/go training - update 1/i)).toBeInTheDocument();
            expect(screen.getByText(/go for daily schedule training at 9.30PM - update 1/i)).toBeInTheDocument();
        })
    });
});
