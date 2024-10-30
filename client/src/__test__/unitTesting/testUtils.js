import axios from 'axios';

jest.mock('axios');

export const mockTodos = [
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

export const setupAxiosMocks = () => {
    axios.get.mockImplementation(() => Promise.resolve({data: mockTodos}));
    jest.clearAllMocks();
};
