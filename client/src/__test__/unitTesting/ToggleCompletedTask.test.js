import { render, screen, fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { setupAxiosMocks } from './testUtils';
import axios from 'axios';
import App from '../../App';
import { mockTodos } from './testUtils';
import '@testing-library/jest-dom/extend-expect';

describe('Toggle completed a task', () => {
    beforeEach(() => setupAxiosMocks());

    test('toggle completed task', async () => {
        axios.get.mockImplementation(() => Promise.resolve({data: mockTodos}));

        let isCompleted = mockTodos[0].isCompleted;

        axios.put.mockImplementation(() => {
            isCompleted = !isCompleted;
            return Promise.resolve({
                data: {
                    updatedTodo: {
                        isCompleted: isCompleted,
                    },
                },
            });
        });

        render(<App/>);

         // ensure there are existing tasks to toggle
        await waitFor(() => {
            expect(screen.getByText(/Go training/i)).toBeInTheDocument();
            expect(screen.getByText(/Go for daily schedule training at 9.30PM/i)).toBeInTheDocument();
        })

        const toggleCheckbox = screen.getByTestId(`checkbox-${mockTodos[0]._id}`);

        expect(toggleCheckbox).toBeInTheDocument();
        expect(toggleCheckbox).not.toBeChecked();

        fireEvent.click(toggleCheckbox);
        await waitFor(() => {
            expect(toggleCheckbox).toBeChecked();
        });

        fireEvent.click(toggleCheckbox);
        await waitFor(() => {
            expect(toggleCheckbox).not.toBeChecked();
        });
    });
});
