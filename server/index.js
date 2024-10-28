const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const dotenv = require('dotenv'); //keep keys confidential

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

const routes = require('./routes/ToDoRoute')

mongoose
.connect(process.env.MONGO_URL)
.then (() => {
    console.log('Connected to MongoDB')
})
.catch((err) => {
    console.log(err)
});

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

app.listen(PORT, () => {
    console.log(`server is up, listening on port ${PORT}`);
});
