// handlers.js
const express = require("express");
const pino = require("pino-http");

const {
  getProducts,
  filterProductsByName,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("./services");

const app = express();

app.use(express.json());
app.use(pino());

app.get("/products", (req, res) => {
  const allProducts = getProducts();
  res.status(200).json(allProducts);
});

app.get("/products/filter", (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: "Name parameter is required" });
  }
  const filteredProducts = filterProductsByName(name);
  if (filteredProducts.length === 0) {
    return res.status(404).json({ error: "No products found with this name" });
  }
  res.status(200).json(filteredProducts);
});

app.post("/products", (req, res) => {
  try {
    const newProduct = addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  try {
    const product = getProductById(productId);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.put("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  try {
    const updatedProduct = updateProduct(productId, req.body);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  try {
    deleteProduct(productId);
    res.sendStatus(204);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = app;
