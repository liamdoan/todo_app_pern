import { render, screen, fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { setupAxiosMocks } from './testUtils';
import axios from 'axios';
import App from '../../App';
import { mockTodos } from './testUtils';
import '@testing-library/jest-dom/extend-expect';

describe('Delete a task', () => {
    beforeEach(() => setupAxiosMocks());

    test('delete a task, and it should disappear from the list', async () => {
        axios.get.mockImplementation(() => Promise.resolve({data: mockTodos}));
        axios.delete.mockImplementation(() => Promise.resolve({}));

        render (<App/>);

        await waitFor(() => {
            expect(screen.getByText(/go training/i)).toBeInTheDocument();
            expect(screen.getByText(/go for daily schedule training at 9.30PM/i)).toBeInTheDocument();
        })

        const deleteBtn = screen.getByTestId(`delete-btn-${mockTodos[0]._id}`);
        fireEvent.click(deleteBtn);

        await waitFor(() => {
            // getByText throws error if it can't find an element. This helps with asserting
            // if elem is existing, and catching missing elem.
            // queryByText returns null if not finding any elems, good for expecting elems be
            // removed since it returns null with no errors.
            expect(screen.queryByText(/go training/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/go for daily schedule training at 9.30PM/i)).not.toBeInTheDocument();
        })
    });
});
