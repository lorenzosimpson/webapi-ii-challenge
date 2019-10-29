const express = require('express');
const postRouter = require('./postRouter');

const server = express();


server.use(express.json())


server.use('/api/posts', postRouter)

server.listen(5000, () => console.log('\n=== Server listening on port 5000 ===\n'))