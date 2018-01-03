import { Component, OnInit } from '@angular/core';
import * as io from "socket.io-client";

// Import the DataService
import { DataService } from '../../data.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  currentJustify = 'justified';
  OnTime = {hour: 6, minute: 30};
  OffTime = {hour: 23, minute: 0};

  constructor(private _dataService: DataService) { }

  ngOnInit() {
  }

  change(e){
    console.log(e.target.checked);
    if(e.target.checked){
      this.SendDisplayTimeEnable();
    }
    else if(!e.target.checked){
      this.SendDisplayTimeDisable();
    }
  }

  SendDisplayTimeEnable(){
    this._dataService.sendDisplayTimeEnable(`${this.OnTime.hour}:${this.OnTime.minute};${this.OffTime.hour}:${this.OffTime.minute}`);
  }
  SendDisplayTimeDisable(){
    this._dataService.sendDisplayTimeDisable();
  }
}
