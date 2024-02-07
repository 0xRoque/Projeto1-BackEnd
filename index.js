const Joi = require("joi");
const pino = require("pino-http");
const express = require("express");
const app = express();

app.use(express.json());
app.use(pino());

const products = [
  {
    id: 1,
    name: "Apple Vision Pro",
    description:
      "Apple Vision Pro is a spatial computer that blends digital content and apps into your physical space, and lets you navigate using your eyes, hands, and voice.",
    price: 3500.0,
    tags: ["tag1", "tag2"],
  },
];

// Rota para obter todos os produtos
app.get("/products", (req, res) => {
  res.status(200).json(products);
});

// Schema para validar produtos
const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number(),
  tags: Joi.array().items(Joi.string()),
});

// Rota para adicionar um novo produto
app.post("/products", (req, res) => {
  const { error, value } = productSchema.validate(req.body);
  if (error) {
    return res.status(400).json(error.details);
  }

  // Adicionar ao banco de dados (array products)
  const newProduct = {
    id: products.length + 1,
    ...value,
  };
  products.push(newProduct);

  // Resposta
  res.status(201).json(newProduct);
});

// Rota para obter um produto por ID
app.get("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find((p) => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.status(200).json(product);
});

// Rota para atualizar um produto existente
app.put("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex((p) => p.id === productId);
  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  const { error, value } = productSchema.validate(req.body);
  if (error) {
    return res.status(400).json(error.details);
  }

  // Atualizar o produto no banco de dados (array products)
  products[productIndex] = {
    ...products[productIndex],
    ...value,
  };

  // Resposta
  res.status(200).json(products[productIndex]);
});

// Rota para deletar um produto
app.delete("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex((p) => p.id === productId);
  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Remover o produto do banco de dados (array products)
  products.splice(productIndex, 1);

  // Resposta
  res.sendStatus(204); // No Content
});

app.listen(3000, () => {
  console.log("Server is running (express)");
});
