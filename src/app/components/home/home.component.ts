import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {NgbTimepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';
import { Router } from '@angular/router';

import {DataService} from '../../data.service';
import { Alarm } from '../../model/alarm';
import * as io from "socket.io-client";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchCriteria: boolean;
  alarms: Alarm[];
  newAlarm: Alarm;

  temperature: string;
  temperatures: string[] = [];
  tempLabel: string = 'measuring';
  lightValue: string;
  lights: string[] = [];
  lightLabel: string = 'measuring';
  
  onChartClick(event) {
    console.log(event);
  }

  // Create an instance of the DataService through dependency injection
  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit() {
    this.searchCriteria = true;
    this.getAlarms();

    this.dataService
      .getTemperature()
      .subscribe((temperature: string) => {
        this.temperatures.push(temperature);
	console.log("aantal: "+ this.temperatures.length);
	this.refresh();
      });

    this.dataService
      .getLight()
      .subscribe((lightValue: string) => {
        this.lights.push(lightValue);
        this.refresh();
      });
  }
  
  refresh(){
	var tempNum = Number(this.temperatures[this.temperatures.length-1]);
	this.tempLabel = (Math.round( tempNum * 10) / 10).toString();

	var lightNum = Number(this.lights[this.lights.length-1]);
        this.lightLabel = (Math.round( lightNum * 10) / 10).toString();
  }

  

  getAlarms(){
    console.log("zoeken naar "+this.searchCriteria);
//    this.searchCriteria = true;   //only active alarms
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


}
