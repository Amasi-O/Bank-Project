const routes = require('next-routes')();

routes
    .add('/bank/admin', '/bank/admin')
    .add('/bank/new', '/bank/new')
    .add('/bank/:address', '/bank/show');
    
   

module.exports = routes;