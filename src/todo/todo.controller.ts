import { APIGatewayProxyEvent } from "aws-lambda";
import { TodoService } from "./todo.service";
import { CreateTodoDto, UpdateTodoDto } from "./todo.dto";

export class TodoController {
  private readonly todoService;

  constructor() {
    this.todoService = new TodoService();
  }

  async createTodo(event: APIGatewayProxyEvent) {
    const dto: CreateTodoDto = JSON.parse(event.body!);
    const todo = await this.todoService.createTodo(dto);
    return {
      statusCode: 201,
      body: JSON.stringify(todo),
    };
  }

  async updateTodo(event: APIGatewayProxyEvent) {
    const todoId = event.pathParameters!.todoId!;
    const dto: UpdateTodoDto = JSON.parse(event.body!);
    const todo = await this.todoService.updateTodo(todoId, dto);
    return {
      statusCode: 200,
      body: JSON.stringify(todo),
    };
  }

  async getTodo(event: APIGatewayProxyEvent) {
    const todoId = event.pathParameters!.todoId!;
    const todo = await this.todoService.getTodo(todoId);
    return {
      statusCode: 200,
      body: JSON.stringify(todo),
    };
  }

  async getAllTodo(_event: APIGatewayProxyEvent) {
    const todo = await this.todoService.getAllTodo();
    return {
      statusCode: 200,
      body: JSON.stringify(todo),
    };
  }

  async deleteTodo(event: APIGatewayProxyEvent) {
    const todoId = event.pathParameters!.todoId!;
    await this.todoService.deleteTodo(todoId);
    return {
      statusCode: 204,
    };
  }
}
