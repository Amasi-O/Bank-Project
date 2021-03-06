const { createServer } = require('http');
const next = require('next');
require('./fireBaseConfig')

const app = next({
    dev: process.env.NODE_ENV !== 'production'
});

const routes = require('./routs');
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
    createServer(handler).listen(3000, (err) => {
        if (err) throw err;
        console.log('Ready on localhost:3000');
    });
});