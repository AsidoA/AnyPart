const express = require('express');

const router = express.Router();
const clients = [];

const createEventStream = (res, msg) => {
    res.write(`data: ${JSON.stringify({ message: msg })}\n\n`);
};

router.get('/', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });

    clients.push(res);

    req.on('close', () => {
        clients.splice(clients.indexOf(res), 1);
    });
});

module.exports = { router, clients, createEventStream };
