import { Handler } from "aws-lambda";
import { TodoController } from "./todo.controller";
import { handleRequest } from "../middleware/handler.middleware";

const todoController = new TodoController();

export const createTodo: Handler = handleRequest((event) => todoController.createTodo(event));

export const updateTodo: Handler = handleRequest((event) => todoController.updateTodo(event));

export const getTodo: Handler = handleRequest((event) => todoController.getTodo(event));

export const getAllTodo: Handler = handleRequest((event) => todoController.getAllTodo(event));

export const deleteTodo: Handler = handleRequest((event) => todoController.deleteTodo(event));
