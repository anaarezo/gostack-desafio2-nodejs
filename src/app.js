const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/**
 * POST: A rota deve receber title, url e techs
 */
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);
  return response.json(repository);
});

/**
 * GET: Listar todos os repositórios
 */
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

/**
 * PUT: Alterar apenas as informações do repositório de id equivalente
 */
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repository = repositories.find(repo => {
    return repo.id === id;
  });
  console.log(repository);

  if (!repository) {
    return response.status(400).json({ error: "Repository not found!" });
  }

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);
  repositories[repositoryIndex] = { ...repository, title, url, techs };
  return response.json(repositories[repositoryIndex]);
});

/**
 * DELETE: remover repositório de id equivalente
 */
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found!" });
  }

  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

/**
 * POSt: Aumentar o número de likes
 */
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repository = repositories.find(repo => {
    return repo.id === id;
  });
  console.log(repository);

  if (!repository) {
    return response.status(400).json({ error: "Repository not found!" });
  }

  const { likes } = repository;
  const incrementLikes = likes + 1;
  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  repositories[repositoryIndex] = { ...repository, likes: incrementLikes };
  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
