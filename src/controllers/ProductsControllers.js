const knex = require('../database/knex');
const AppError = require('../utils/AppError');

class ProductsControllers {
  async create(request, response) {
    const { title, salePrice, costPrice, category, quantity } = request.body;
    const [product_id] = await knex('products').insert({
      title,
      salePrice,
      costPrice,
      category,
      quantity,
    });

    return response.json({ id: product_id });
  }

  async delete(request, response) {
    const { id } = request.params;
    await knex('products').where({ id }).delete();
    return response.json();
  }

  async update(request, response) {
    const { title, salePrice, costPrice, category, quantity } = request.body;
    const { id } = request.params;

    const product = await knex('products').where({ id });

    if (product.length === 0) {
      throw new AppError('Prato não encontrado!');
    }

    product.title = title ?? product.title;
    product.salePrice = salePrice ?? product.salePrice;
    product.costPrice = costPrice ?? product.costPrice;
    product.category = category ?? product.category;
    product.quantity = quantity ?? product.quantity;

    await knex('products')
      .where({ id })
      .update({ title, salePrice, costPrice, category, quantity });

    return response.json();
  }

  async show(request, response) {
    const { id } = request.params;
    const product = await knex('products').where({ id }).first();

    if (!product) {
      throw new AppError('Pieza no encontrada!');
    }

    return response.json({ product });
  }

  async index(request, response) {
    let { title, returnAll } = request.query;
    let products = '';

    const isCategory = await knex('products').whereLike(
      'products.category',
      `%${title}%`
    );

    if (returnAll) {
      products = await knex('products').orderBy('category');
    } else if (isCategory.length > 0) {
      products = await knex('products')
        .whereLike('products.category', `%${title}%`) // Tanto antes quanto depois, se houver title %%
        .orderBy('products.category')
        .orderBy('products.title');
    } else {
      products = await knex('products')
        .whereLike('products.title', `%${title}%`) // Tanto antes quanto depois, se houver title %%
        .orderBy('products.category')
        .orderBy('products.title');
    }

    return response.json(products);
  }

  async sell(request, response) {
    const { cart } = request.body;

    cart.forEach(async function (productSold) {
      const product = await knex('products').where({ id: productSold.id });

      const newQuantity = product[0].quantity - productSold.quantity;

      if (newQuantity >= 0) {
        await knex('products')
          .where({ id: productSold.id })
          .update({ quantity: newQuantity });
      }
    });

    return response.json();
  }
}

module.exports = ProductsControllers;
