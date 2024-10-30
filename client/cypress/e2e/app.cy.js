describe('End to end test with Cypress', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/');

        // simulate request, use ** to match with any prefix
        // never interact directly with DB on testing env
        cy.intercept('GET', '**/get', {
            status: 200,
            body: [
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
            ],
        }).as('getTasks');
    });

    it('should load the app', () => {
        cy.get('[data-testid="app-title"]')
            .should('exist')
            .invoke('text')
            .should('not.be.empty');
    });

    it('should not show task list if DB is empty', () => {
        cy.get('.todo-row').should('not.exist')
    });

    it('should show task list if there is data', () => {


        //wait until simulated request is done
        cy.wait('@getTasks');

        cy.get('.todo-row')
            .should('exist')
            .should('have.length.greaterThan', 0);
    });

    it('should add a new task and show on list', () => {
        cy.intercept('POST', '**/save', {
            status: 201,
            body: {
                    _id: '3',
                    task: 'new task 1',
                    description: 'new description 1',
                    isCompleted: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
            }
        ).as('addTask');

        const taskInput = cy.get('.todo-input');
        const descInput = cy.get('.desc-input');
        const submitBtn = cy.get('.submit-button');

        taskInput.type('new task 1');
        descInput.type('new description 1');
        submitBtn.click();

        cy.wait('@addTask');

        cy.get('.todo-row').should('exist');
        cy.get('.todo-row')
            .should('contain','new task 1')
            .and('contain', 'new description ');
    });

    it('should edit an existing task', () => {
        cy.intercept('PUT', '**/update/1', {
            status: 200,
            body: {
                message: 'Task updated!',
                updatedTodo: {
                    _id: '1',
                    task: 'Go training - edit 1',
                    description: 'Go for daily schedule training at 9.30PM - edit 1',
                    isCompleted: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
            }
        }).as('updateTask');

        // cy.wait('@getTasks');

        cy.get('.todo-row').should('exist').and('be.visible');

        cy.get('[data-testid="edit-btn-1"]', { timeout: 10000 }).should('exist').click();

        cy.get('.input-edit-task').clear().type('Go training - edit 1');
        cy.get('.input-edit-desc').clear().type('Go for daily schedule training at 9.30PM - edit 1');
        cy.get('[data-testid=submit-edit-btn-1]').click();

        cy.wait('@updateTask');
        
        cy.get('.todo-row')
            .should('contain', 'Go training - edit 1')
            .and('contain', 'Go for daily schedule training at 9.30PM - edit 1');
    });

    it('should check completed a task', () => {
        cy.intercept('PUT', '**/toggle/1', {
            status: 200,
            body: {
                message: 'Task toggled!',
                updatedTodo: {
                    _id: '1',
                    task: 'Go training',
                    description: 'Go for daily schedule training at 9.30PM',
                    isCompleted: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
            },
        }).as('toggleTask');

        // cy.wait('@getTasks')

        // check action
        cy.get('[data-testid="checkbox-1"]').click();

        cy.wait('@toggleTask');

        cy.get('[data-testid="checkbox-1"]').should('be.checked');
    });

    it('should delete a task', () => {
        cy.intercept('DELETE', '**/delete/1', {
            status: 200,
            body: 'Task deleted!'
        }).as('deleteTask');;
   
        // cy.wait('@getTasks');

        cy.get('[data-testid="delete-btn-1"]').should('exist');
        cy.get('[data-testid="delete-btn-1"]').click();
        
        cy.wait('@deleteTask');

        cy.get('.todo-row').should('not.contain', 'Go training');
    })    
})
