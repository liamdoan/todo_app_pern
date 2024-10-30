import { render, screen, fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import App from '../App';
import axios from 'axios';
import '@testing-library/jest-dom/extend-expect'

jest.mock('axios');

const mockTodos = [
    {
        _id: '1',
        task: 'Go training',
        description: 'Go for daily schedule training at 9.30PM',
        isCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: '2',
        task: 'Research market and work',
        description: 'Start planned work and study at 10AM',
        isCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

describe('App Component', () => {
    beforeEach(() => {
        // Clear any previous mocks before each test
        jest.clearAllMocks();
    });

    test('renders the App component with Spinner since data is not yet done fetching', () => {
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
