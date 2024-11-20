import {
  DeleteCommand,
  DeleteCommandInput,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
  ScanCommand,
  ScanCommandInput,
  UpdateCommand,
  UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { dynamoDBClient } from "../db";
import { Todo } from "./todo.model";
import { randomUUID } from "crypto";
import { CreateTodoDto, UpdateTodoDto } from "./todo.dto";
import { BadRequestError, NotFoundError } from "../errors";

export class TodoService {
  private readonly documentClient: DynamoDBDocumentClient;

  private TODO_TABLE = process.env.TODO_TABLE as string;

  constructor() {
    this.documentClient = dynamoDBClient();
  }

  async createTodo(dto: CreateTodoDto): Promise<Todo> {
    this.validateCreateTodoDto(dto);

    const itemData: Todo = {
      todoId: randomUUID(),
      title: dto.title,
      description: dto.description,
      status: false,
      createdAt: new Date().toISOString(),
    };

    const commandInput: PutCommandInput = {
      TableName: this.TODO_TABLE,
      Item: itemData,
    };
    const command = new PutCommand(commandInput);
    const todo = await this.documentClient.send(command);
    return todo.Attributes as Todo;
  }

  async updateTodo(todoId: string, dto: UpdateTodoDto): Promise<Todo> {
    this.validateUpdateTodoDto(dto);
    await this.getTodo(todoId);

    const commandInput: UpdateCommandInput = {
      TableName: this.TODO_TABLE,
      Key: { todoId },
      UpdateExpression: "set #title = :title, #description = :description",
      ExpressionAttributeNames: {
        "#title": "title",
        "#description": "description",
      },
      ExpressionAttributeValues: {
        ":title": dto.title,
        ":description": dto.description,
      },
      ReturnValues: "ALL_NEW",
    };
    const command = new UpdateCommand(commandInput);
    const todo = await this.documentClient.send(command);
    return todo.Attributes as Todo;
  }

  async getTodo(todoId: string): Promise<any> {
    const commandInput: GetCommandInput = {
      TableName: this.TODO_TABLE,
      Key: { todoId },
    };
    const command = new GetCommand(commandInput);
    const todo = await this.documentClient.send(command);
    if (!todo.Item) {
      throw new NotFoundError("Todo not found");
    }
    return todo.Item as Todo;
  }

  async getAllTodo(): Promise<Todo[]> {
    const commandInput: ScanCommandInput = {
      TableName: this.TODO_TABLE,
    };
    const command = new ScanCommand(commandInput);
    const todo = await this.documentClient.send(command);
    return todo.Items as Todo[];
  }

  async deleteTodo(todoId: string): Promise<void> {
    await this.getTodo(todoId);

    const commandInput: DeleteCommandInput = {
      TableName: this.TODO_TABLE,
      Key: { todoId },
    };
    const command = new DeleteCommand(commandInput);
    await this.documentClient.send(command);
  }

  private validateCreateTodoDto(dto: CreateTodoDto) {
    if (!dto) {
      throw new BadRequestError("Request body must be provided");
    }

    if (!dto.title) {
      throw new BadRequestError("Title is required");
    }

    if (!dto.description) {
      throw new BadRequestError("Description is required");
    }
  }

  private validateUpdateTodoDto(dto: UpdateTodoDto) {
    if (!dto) {
      throw new BadRequestError("Request body must be provided");
    }

    if (!dto.title) {
      throw new BadRequestError("Title is required");
    }

    if (!dto.description) {
      throw new BadRequestError("Description is required");
    }
  }
}
