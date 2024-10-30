import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

const server = setupServer(...handlers);

beforeAll(() => server.listen()); //start msw server before testing
afterEach(() => server.resetHandlers()); // reset handlers
afterAll(() => server.close()); // close server after done testing

describe ('App integration test', () => {
    test('fetch task data and show the list', async () => {
        render(<App/>);
        expect(screen.findByText(/go training/i)).toBeInTheDocument();
    })
});


/* NOTE
- Currently facing issue with TextEncoder is not defined,
following by TransformStream is not defined.
- Therefore, integration testing with mocking of server request needs
more investigation.
*/