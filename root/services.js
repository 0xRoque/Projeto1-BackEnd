// services.js
const Joi = require("joi");
const { products } = require("./data");

const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number(),
  tags: Joi.array().items(Joi.string()),
});

function getProducts() {
  return products;
}

function filterProductsByName(name) {
  return products.filter((product) =>
    product.name.toLowerCase().includes(name.toLowerCase())
  );
}

function addProduct(product) {
  const { error, value } = productSchema.validate(product);
  if (error) {
    throw new Error(error.details);
  }

  const newProduct = {
    id: products.length + 1,
    ...value,
  };
  products.push(newProduct);
  return newProduct;
}

function getProductById(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
}

function updateProduct(productId, newData) {
  const productIndex = products.findIndex((p) => p.id === productId);
  if (productIndex === -1) {
    throw new Error("Product not found");
  }

  const { error, value } = productSchema.validate(newData);
  if (error) {
    throw new Error(error.details);
  }

  products[productIndex] = {
    ...products[productIndex],
    ...value,
  };

  return products[productIndex];
}

function deleteProduct(productId) {
  const productIndex = products.findIndex((p) => p.id === productId);
  if (productIndex === -1) {
    throw new Error("Product not found");
  }

  products.splice(productIndex, 1);
}

module.exports = {
  getProducts,
  filterProductsByName,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
