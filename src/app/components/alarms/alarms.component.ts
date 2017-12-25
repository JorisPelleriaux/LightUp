import { Component, OnInit } from '@angular/core';
import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {NgbTimepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {DataService} from '../../data.service';
import { Router } from '@angular/router';
import { Alarm } from '../../model/alarm';

@Component({
  selector: 'app-alarms',
  templateUrl: './alarms.component.html',
  styleUrls: ['./alarms.component.css'],
  providers: [NgbTimepickerConfig] // add NgbTimepickerConfig to the component providers
})
export class AlarmsComponent implements OnInit {
  alarms: Alarm[];
  newAlarm: Alarm;

  public isCollapsed = true;	//Add alarm menu
  time: NgbTimeStruct = {hour: 8, minute: 0, second: 30};	//Time input
  duration : NgbTimeStruct = {hour: 0, minute: 8, second: 30}; 
  model = {
    right: false
  };
  
  constructor(private dataService: DataService, config: NgbTimepickerConfig, private router: Router) { 
    // customize default values of ratings used by this component tree
    config.seconds = false;
    config.spinners = false;
  }
  ngOnInit() {
    this.newAlarm = Alarm.CreateDefault();
  }

  insertAlarm() {
    console.log("in methode");
    this.dataService
    .insertNewAlarm(this.newAlarm)
    .subscribe(
      data => {
         this.newAlarm._id = data.id;
         this.alarms.push(this.newAlarm);
         this.newAlarm = Alarm.CreateDefault();
    
         console.log("Added alarm.");
      }
    )
}

  submit() {
     console.log("submit");
     this.isCollapsed = false;
  }
}
