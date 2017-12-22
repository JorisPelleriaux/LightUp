import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import * as io from 'socket.io-client';

@Injectable()
export class DataService {
  public ip = window.location.hostname;
  public url = 'http://'+this.ip+':3000';
  public socket;
  
  result:any;

  constructor(private _http: Http) {
	this.socket = io(this.url);
  }

  getUsers() {
    return this._http.get("/api/users")
      .map(result => this.result = result.json().data);
  }

  public sendColor(data){
        this.socket.emit("color", data); //send push button status to back to server
  }

  public sendLight(data){
	this.socket.emit("light", data); //send push button status to back to server
  }

  public sendMessage(message) {
        this.socket.emit('new-message', message);
  }

}
