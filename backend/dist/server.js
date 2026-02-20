"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app = require('./app');
const { connectDb } = require('./config/db');
const { port } = require('./config/env');
async function start() {
    try {
        await connectDb();
        app.listen(port, () => {
            console.log(`Backend running on http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error('Failed to start server', error);
        process.exit(1);
    }
}
start();
