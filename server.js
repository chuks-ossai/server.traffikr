const express = require('express');
const server = express();

const authRoutes = require('./routes/auth');

server.use('/api/v1', authRoutes);


const port = process.env.PORT || 8000;

server.listen(port, () => {
    console.log(`server listening on ${port}`)
})