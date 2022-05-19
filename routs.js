const routes = require('next-routes')();

routes
    .add('/bank/admin', '/bank/admin')
    .add('/bank/new', '/bank/new')
    .add('/bank/login', '/bank/login')
    .add('/bank/:address/withdraw', '/bank/withdraw')
    .add('/bank/:address/deposit', '/bank/deposit')
    .add('/bank/:address/transfer', '/bank/transfer')
    .add('/bank/:address', '/bank/show');
    
   

module.exports = routes;