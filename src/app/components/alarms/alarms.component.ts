import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {NgbTimepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';
import { Router } from '@angular/router';

import {DataService} from '../../data.service';
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
  editAlarm: Alarm;
  searchCriteria: string;
  selectedAnimation: string = 'brightness';
  private _success = new Subject<string>();

  staticAlertClosed = false;
  successMessage: string;


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
    setTimeout(() => this.staticAlertClosed = true, 20000);

    this._success.subscribe((message) => this.successMessage = message);
    debounceTime.call(this._success, 5000).subscribe(() => this.successMessage = null);

    this.searchCriteria = '';
    this.getAlarms();
    this.newAlarm = Alarm.CreateDefault();
    this.editAlarm = Alarm.CreateDefault();
  }

  //event handler for the select element's change event
  selectChangeHandler (event: any) {
    //update the ui
    this.selectedAnimation = event.target.value;
  }

  insertAlarm() {
    this._success.next("New alarm added");
    this.newAlarm.color = this.selectedAnimation;
    this.isCollapsed = true;
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

  getAlarms(){
    console.log("zoeken naar "+this.searchCriteria);
    this.dataService.getAlarms(this.searchCriteria)
    .subscribe(
      data => {
         this.alarms = [];
         data.forEach(
           element => {
             var newAlarm = new Alarm(element._id, 
                                element.active, 
                                element.waketime,
                                element.duration,
                                element.color);
             this.alarms.push(newAlarm);
           })
      })
  }

  deleteAlarm(alarm:Alarm)
  {
    this._success.next("Alarm successfully deleted");
    this.dataService.deleteAlarm(alarm)
    .subscribe(
      data => {
        this.alarms.splice(this.alarms.indexOf(alarm), 1);
        console.log("Alarm deleted!");
      })
  }

  updateAlarm(alarm:Alarm) {
    this.dataService
    .updateAlarm(this.newAlarm)
    .subscribe(
      data => {
         var index = this.alarms.findIndex(item => item._id === this.editAlarm._id);
         this.alarms[index] = this.editAlarm;
         this.editAlarm = Alarm.CreateDefault();
    
         console.log("Added alarm.");
      }
    )
  }

  setEditAlarm(alarm: Alarm){
    this.editAlarm = new Alarm(alarm._id, alarm.active, alarm.waketime, alarm.duration, alarm.color);
  }
}
