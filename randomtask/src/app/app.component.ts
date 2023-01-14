import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Task } from './models/Task';
import { Todo } from './models/todo';
import { TaskService } from './services/Task.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  public tasks: Task[] = [];
  public tasksSub: Subscription | undefined;

  public todo:Todo = {
    title: ''
  }

  public isLoading: boolean = false;
  private isLoadingSub: Subscription | undefined;
  
  constructor(
    private _taskService: TaskService,
  ){}

  ngOnInit(): void {
    this._taskService.getAll().subscribe(result =>{
      if(result.message === 'success'){
        this.tasks = result.data;
        console.log(result.data);
      }
    })
  }

  public onSubmit() : void{
    this._taskService.create(this.todo).subscribe(result =>{    
      if(result.message === 'success'){
        window.location.reload();
      }
    })
  }
  
 
}
