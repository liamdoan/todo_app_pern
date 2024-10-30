import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { setupAxiosMocks } from './testUtils';
import axios from 'axios';
import App from '../../App';
import { mockTodos } from './testUtils';
import '@testing-library/jest-dom/extend-expect';

describe('App component rendering', () => {
    beforeEach(() => setupAxiosMocks());

    test('render App with spinner when data is loading', () => {
        axios.get.mockImplementation(() => new Promise(() => {})); //mock axios that never resolves the promise

        const {container} = render(<App />);
        // check for specific elem that animates the spinner, in case there are further dev for it;
        const spinner = container.querySelector('.loader');
        
        expect(spinner).toBeInTheDocument();
    });

    test ('shows proper task data from database after done fetching', async () => {
        axios.get.mockImplementation(() => Promise.resolve({data: mockTodos}));

        const {container} = render(<App />);

        // const spinner = container.querySelector('.loader');
        // await waitFor(() => {
        //     expect(spinner).not.toBeInTheDocument();
        // })

        await waitForElementToBeRemoved(() => container.querySelector('.loader'));

        expect(screen.getByText(/go training/i)).toBeInTheDocument();
        expect(screen.getByText(/Go for daily schedule training at 9.30PM/i)).toBeInTheDocument();
        expect(screen.getByText(/Research market and work/i)).toBeInTheDocument();
        expect(screen.getByText(/Start planned work and study at 10AM/i)).toBeInTheDocument();
    });
});
