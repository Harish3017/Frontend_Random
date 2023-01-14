import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Task } from '../models/Task';
import { environment } from 'src/environments/environment';
import { ServiceResponse } from '../models/ServiceResponse';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasks: Task[] = [];
  private tasksSub = new Subject<Task[]>();

  constructor(
    private http: HttpClient
  ) { }

  public getTasks(): Task[]{
    this.tasksSub.next(this.tasks);
    return this.tasks;
  }

  public searchTaskForTitle(keyword:string):void{
    if(keyword !== ''){
      const tasks: Task[] = [];
      
      this.tasks.map(task => {
        const isTask = task.title.toLowerCase().includes(keyword.toLowerCase());
        if(isTask === true){
          tasks.push(task);
        }
      });
      this.tasksSub.next(tasks);
    }else{
      this.tasksSub.next([]);
    }
  }

  public getAll(): Observable<ServiceResponse>{
    return this.http.get<ServiceResponse>(`${API_URL}/task/`);
  }

  public getSingle(title:string): Observable<ServiceResponse>{
    return this.http.get<ServiceResponse>(`${API_URL}/task/${title}`);
  }

  public update(data:Task): Observable<ServiceResponse>{
    return this.http.patch<ServiceResponse>(`${API_URL}/task/${data._id}`,data);
  }

  public getSearchTask(): void{
    this.http.get<ServiceResponse>(`${API_URL}/task`).subscribe(result=>{
      if(result.message === 'success'){
        this.tasks = result.data;
        this.tasksSub.next(this.tasks);      
      }
    });
  }

  public getAllUpdatedTask(): Observable<Task[]>{
    return this.tasksSub.asObservable();
  }

  public create(data:any): Observable<ServiceResponse>{
    return this.http.post<ServiceResponse>(`${API_URL}/task/`, data);
  }

  public delete(id:any): Observable<ServiceResponse>{
    return this.http.delete<ServiceResponse>(`${API_URL}/task/`+id);
  }



}
