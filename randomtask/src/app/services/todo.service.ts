import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Todo } from '../models/todo';
import { environment } from 'src/environments/environment';
import { ServiceResponse } from '../models/ServiceResponse';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private todos: Todo[] = [];
  private todosSub = new Subject<Todo[]>();

  constructor(
    private http: HttpClient
  ) { }

  public getTodos(): Todo[]{
    this.todosSub.next(this.todos);
    return this.todos;
  }

  public searchTodoForTitle(keyword:string):void{
    if(keyword !== ''){
      const todos: Todo[] = [];
      
      this.todos.map(todo => {
        const isTodo = todo.title.toLowerCase().includes(keyword.toLowerCase());
        if(isTodo === true){
          todos.push(todo);
        }
      });
      this.todosSub.next(todos);
    }else{
      this.todosSub.next([]);
    }
  }

  public getAll(): Observable<ServiceResponse>{
    return this.http.get<ServiceResponse>(`${API_URL}/task/`);
  }

  public getSingle(title:string): Observable<ServiceResponse>{
    return this.http.get<ServiceResponse>(`${API_URL}/task/${title}`);
  }

  public update(data:Todo): Observable<ServiceResponse>{
    return this.http.patch<ServiceResponse>(`${API_URL}/task/${data._id}`,data);
  }

  public getSearchTodo(): void{
    this.http.get<ServiceResponse>(`${API_URL}/task`).subscribe(result=>{
      if(result.message === 'success'){
        this.todos = result.data;
        this.todosSub.next(this.todos);      
      }
    });
  }

  public getAllUpdatedTodo(): Observable<Todo[]>{
    return this.todosSub.asObservable();
  }

  public create(data:any): Observable<ServiceResponse>{
    return this.http.post<ServiceResponse>(`${API_URL}/task/`, data);
  }

  public delete(id:any): Observable<ServiceResponse>{
    return this.http.delete<ServiceResponse>(`${API_URL}/task/`+id);
  }



}
