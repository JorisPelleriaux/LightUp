import { Component } from '@angular/core';
import * as io from "socket.io-client";

// Import the DataService
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  // Define a users property to hold our user data
  users: Array<any>;
  message: string; 
  lightValue: boolean;
  colorValue: string;

  // Create an instance of the DataService through dependency injection
  constructor(private _dataService: DataService) {

    // Access the Data Service's getUsers() method we defined
    this._dataService.getUsers()
        .subscribe(res => this.users = res);
  }
  sendColor() {
        this._dataService.sendColor(this.colorValue);
  }
  sendLight() {
	this._dataService.sendLight(this.lightValue);
  }
  sendMessage() {
	this._dataService.sendMessage(this.message);
	this.message = '';
  }
}
