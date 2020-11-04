import { Body, Controller, Delete, Get, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { Param, Query } from '@nestjs/common/decorators/http/route-params.decorator';
import { strict } from 'assert';
import { stat } from 'fs';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto): Task[] {
        if(Object.keys(filterDto).length) 
            return this.tasksService.getTaskWithFilters(filterDto);
        else
            return this.tasksService.getAllTasks();
    }

    @Get('/:id')
    getTaskByID(@Param('id') id: string): Task {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto) : Task {
       return this.tasksService.createTask(createTaskDto);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id: string) : void {
        this.tasksService.deleteTask(id);
    }

    @Patch('/:id/status')
    updateStatusTask(@Param('id') id: string, @Body('status', TaskStatusValidationPipe) status: TaskStatus) : Task {
        return this.tasksService.updateStatusTask(id, status);
    }
}