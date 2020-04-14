const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepository(request, response, next) {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repository => repository.id === id);

  if (repoIndex === -1) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  request.repository_index = repoIndex;

  return next();
}

app.use('/repositories/:id', validateRepository);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

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

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { repository_index } = request;
  const { title, url, techs } = request.body;

  const repository = repositories[repository_index];

  if (title) {
    repository.title = title;
  }

  if (url) {
    repository.url = url;
  }

  if (techs !== undefined) {
    repository.techs = techs;
  }

  repositories[repository_index] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { repository_index } = request;
  
  repositories.splice(repository_index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { repository_index } = request;
  
  repositories[repository_index].likes += 1;

  return response.json(repositories[repository_index]);
});

module.exports = app;
