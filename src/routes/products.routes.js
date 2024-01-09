const { Router } = require('express');

const ProductsControllers = require('../controllers/ProductsControllers');

const productsRoutes = Router();

const productsControllers = new ProductsControllers();

const verifyUserAuthorization = require('../middlewares/verifyUserAuthorization');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

productsRoutes.get('/:id', productsControllers.show);
productsRoutes.get('/', productsControllers.index);
productsRoutes.put('/sell', productsControllers.sell);

productsRoutes.use(ensureAuthenticated);
productsRoutes.use(verifyUserAuthorization('admin'));

productsRoutes.post('/create', productsControllers.create);
productsRoutes.put('/update/:id', productsControllers.update);

productsRoutes.delete('/:id', productsControllers.delete);

module.exports = productsRoutes;
