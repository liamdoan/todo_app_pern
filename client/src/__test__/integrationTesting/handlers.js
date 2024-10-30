//msw is used to mock API requests, 
// allowing test the app without real backend

import {rest} from 'msw';

export const handlers = [
    rest.get('/get', (req, res, ctx) => {
        return res(
            ctx.json([
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
            ])
        );
    }),

    rest.post('/save', (req, res, ctx) => {
        const {task, description} = req.body;
        return res(
            ctx.status(201),
            ctx.json({
                _id: '3',
                task,
                description,
                isCompleted: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            })
        );
    }),

    rest.put('/update/:id', (req, res, ctx) => {
        const {id} = req.params;
        const {task, description} = req.body;
        return res(
            ctx.json({
                _id: id,
                task,
                description,
                isCompleted: false,
                createdAt,
                updatedAt: new Date().toISOString(),
            })
        );
    }),

    rest.put('/toggle/:id', (req, res, ctx) => {
        const {id} = req.params;
        const {isCompleted} = req.body;
        return res(
            ctx.json({
                _id: id,
                task,
                description,
                isCompleted: !isCompleted,
                createdAt,
                updatedAt: new Date().toISOString(),
            })
        );
    }),

    rest.delete('/delete/:id', (req, res, ctx) => {
        const {id} = req.param;
        return res(ctx.status(204));
    })
]
