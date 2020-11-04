import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import {v1 as uuid} from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { stat } from 'fs';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];
    
    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTaskById(id: String) {
        return this.tasks.find(task => task.id === id);
    }

    getTaskWithFilters(filterDto: GetTaskFilterDto) : Task[] {
        const { status, search } = filterDto;

        let tasks = this.getAllTasks();

        if(status) {
            tasks = tasks.filter(task => task.status === status);
        }

        if(search) {
            tasks = tasks.filter(task =>
                task.title.includes(search) || 
                task.description.includes(search)
            );
        }

        return tasks;
    }

    createTask(createTaskDto: CreateTaskDto) {
        const {title, description} = createTaskDto;
        const task: Task = {
            id: uuid(),
            title: title,
            description: description, 
            status: TaskStatus.OPEN
        };

        this.tasks.push(task);

        return task;
    }

    deleteTask(id: string): void {
        this.tasks = this.tasks.filter(task => task.id !== id);
    }

    updateStatusTask(id: string, status: TaskStatus): Task {
        let task = this.getTaskById(id);
        task.status = status;
        return task;
    }
}