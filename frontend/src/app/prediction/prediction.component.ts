import { Component, OnInit } from '@angular/core';
import {DataServiceService} from "../data-service.service";
import {HistoricalPrice} from "../../models/HistoricalPrice";
import '../../../../prediction.js';
// declare var requestData: any;

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss']
})
export class PredictionComponent implements OnInit {

  constructor(private service: DataServiceService) {
  }


  ngOnInit(): void {
  }

  request() {
    //requestData('MVZ.A-VS');
  }

}
