require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const server = express();

const authRoutes = require('./routes/auth');

server.use(morgan('dev'));
server.use(express.urlencoded({extended: true}));
server.use(express.json());
server.use(cors());

server.use('/api/v1', authRoutes);


const port = process.env.PORT || 8000;

server.listen(port, () => {
    console.log(`server listening on ${port}`)
})