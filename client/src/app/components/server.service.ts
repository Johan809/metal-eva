import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpRequest,
  HttpEvent,
  HttpHeaders,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  private apiUrl: string;

  constructor(private xhttp: HttpClient) {
    this.apiUrl = 'http://127.0.0.1:8000/';
  }

  public testConnection() {
    return new Promise((res, rej) => {
      this.xhttp.get(this.apiUrl).subscribe(
        (data) => {
          if (data['ok']) alert(data['msg']);
          else alert('Conexion fallida?');
        },
        (err) => console.error(err)
      );
    });
  }

  public async getAnswer(id: number): Promise<object> {
    let url = this.apiUrl + `getAns/${id}`;
    return new Promise((res, rej) => {
      this.xhttp.get(url).subscribe(
        (data) => {
          if (data['ok']) res(data['arg']);
          else res(data['msg']);
        },
        (err) => console.error(err)
      );
    });
  }

  public async regCotization(resume: object): Promise<object> {
    let url = this.apiUrl + `regResume`;
    return new Promise((res, rej) => {
      this.xhttp.post(url, resume).subscribe(
        (data) => {
          if (data['ok']) res(data);
          else res(data['msg']);
        },
        (err) => console.error(err)
      );
    });
  }

  public async saveEvaluation(eva: object): Promise<object> {
    let url = this.apiUrl + `reqEva`;
    return new Promise((res, rej) => {
      this.xhttp.post(url, eva).subscribe(
        (data) => {
          if (data['ok']) res(data);
          else res(data['msg']);
        },
        (err) => console.error(err)
      );
    });
  }

  public async getEva(id: number): Promise<object> {
    let url = this.apiUrl + `getEva/${id}`;
    return new Promise((res, rej) => {
      this.xhttp.get(url).subscribe(
        (data) => {
          if (data['ok']) res(data['arg']);
          else res(data['msg']);
        },
        (err) => console.error(err)
      );
    });
  }
}
