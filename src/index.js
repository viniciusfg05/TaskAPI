const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];
console.log(users);

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.body.status(400).json({ error: "User not found" });
  }

  request.user = user;

  return next();
}

app.post("/users", (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const user = users.some((user) => user.username === username);

  if (user) {
    return response.status(400).json({ error: "User already Exists" });
  }

  const createUser = {
    name,
    username,
    id: uuid(),
    todos: [],
  };

  users.push(createUser);

  return response.status(201).json(createUser);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request;

  const createdTodo = {
    title,
    deadline: new Date(deadline),
    created_at: new Date(),
    done: false,
    id: uuid(),
  };

  user.todos.push(createdTodo);

  return response.status(201).json(createdTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.find((todo) => {
    return todo.id == id;
  });

  if (!todo) {
    return response.status(404).json({ error: "Id não encontrado" });
  }

  const updated = user.todos.find((todo) => {
    return todo;
  });

  updated.title = title;
  updated.deadline = deadline;

  return response.status(200).json(updated);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  const updateDone = user.todos.find((todo) => todo.id === id);

  if (!updateDone) {
    return response.status(404).json({ error: "User not exists" });
  }

  updateDone.done = true;

  return response.status(201).json(updateDone);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({
      error: "Tarefa não encontrada",
    });
  }

  user.todos.splice(todo);

  return response.status(204).json();

  // Complete aqui
  // const { user } = request;
  // const { id } = request.params;
  // const { username } = request.headers;

  // const todoId = user.todos.some((todo) => {
  //   return todo.id == id;
  // });

  // console.log(username);

  // if (todoId) {
  //   const updateDone = user.todos.filter((todo) => {
  //     return todo.id !== id;
  //   });
  //   console.log(updateDone);

  //   return response.status(204);
  // } else {
  //   return response.status(404).json({ error: "User not exists" });
  // }
});

module.exports = app;
