import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions,URLSearchParams  } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Alarm } from './model/alarm';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as io from 'socket.io-client';


let users= [
{name: 'lucia'}
];



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

  insertNewAlarm(alarm:Alarm): Observable<any>{
        return this._http.post(this.url + "/insertAlarm", alarm)
            .map((res:any) => {
                return res.json();
            })
            .catch((error:any) => {
		console.log(error);
                return Observable.throw(error.json ? error.json().error : error || 'Server error')
            }); 
  }

  getAlarms(searchCriteria:any) : Observable<Alarm[]>{
        let params: URLSearchParams = new URLSearchParams();
        params.set('active', searchCriteria);

        return this._http.get(this.url + "/getAlarms", { search: params })
                .map((res:any) => {
                    return res.json();
                })
                .catch((error:any) => {
                    return Observable.throw(error.json ? error.json().error : error || 'Server error')
                }); 
  }

  deleteAlarm(alarm:Alarm): Observable<any>{
        return this._http.post(this.url + "/deleteAlarm", { id: alarm._id })
        .map((res:any) => {
            return res.json();
        })
        .catch((error:any) => {
            return Observable.throw(error.json ? error.json().error : error || 'Server error')
        });
  }

  updateAlarm(alarm:Alarm): Observable<any>{
        return this._http.post(this.url + "/updateAlarm", alarm)
            .map((res:any) => {
                return res.json();
            })
            .catch((error:any) => {
                return Observable.throw(error.json ? error.json().error : error || 'Server error')
            }); 
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

  public getTemperature = () => {
        return Observable.create((observer) => {
            this.socket.on('temp', (data) => {
                observer.next(data);
            });
        });
  }
}
