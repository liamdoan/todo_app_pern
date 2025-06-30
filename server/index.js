const express = require('express');
const cors = require('cors');
const path = require("path");
const dotenv = require('dotenv'); //keep keys confidential
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

const routes = require('./routes/ToDoRoute')

app.use(cors());
app.use(express.json());

app.use('/api',routes);

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'), function(err){
        if(err){
            res.status(500).send(err)
        }
    });
});

// ensure DB is connected before starting server
const startServer = async () => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect to Postgre. Server not started.");
        console.log(err);
    }
};

startServer();
