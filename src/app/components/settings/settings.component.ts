import { Component, OnInit } from '@angular/core';
import * as io from "socket.io-client";
import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {NgbTimepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs/Subject';

// Import the DataService
import { DataService } from '../../data.service';
import { Snooze } from '../../model/snooze';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  currentJustify = 'justified';
  OnTime = {hour: 6, minute: 30};
  OffTime = {hour: 23, minute: 0};
  colorValue: string; //Value of the colorpicker
  lightValue: boolean; //light on/off from checkbox
  snoozetime: {hour: 13, minute: 30, second: 0};
  private _success = new Subject<string>();
  newSnoozeSetting: Snooze;
  
  constructor(private _dataService: DataService, config: NgbTimepickerConfig) {
    config.seconds = false;
    config.spinners = false;
  }

  ngOnInit() {
    this.newSnoozeSetting = Snooze.CreateDefault();
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

  insertSnoozeSettings(){
    this._success.next("New snooze setting added");
    this.newSnoozeSetting.snoozetime = this.snoozetime.hour + ":" + this.snoozetime.minute;
    this.newSnoozeSetting.snooze = true;
    this.newSnoozeSetting.sensor = false;
    this._dataService
    .insertNewSnoozeSettings(this.newSnoozeSetting)
    .subscribe(
      data => {
         this.newSnoozeSetting._id = data.id;
         this.newSnoozeSetting = Snooze.CreateDefault();

         console.log("Added SnoozeSetting");
      }
    )
  }

  SendSnoozeTime(){
    this._dataService.sendSnoozeTime(`${this.snoozetime.hour}:${this.snoozetime.minute}`);
  }

  sendColor() {
        this._dataService.sendColor(this.colorValue);
  }

  sendLight() {
	this._dataService.sendLight(this.lightValue);
  }
}
