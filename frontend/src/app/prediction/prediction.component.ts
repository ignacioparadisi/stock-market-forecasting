import { Component, OnInit } from '@angular/core';
import {DataServiceService} from "../data-service.service";
import {HistoricalPrice} from "../../models/HistoricalPrice";
import * as danfo from 'danfojs';

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

  requestData() {
    console.log('Holi')
    this.service.getData('MVZ.A-vs').subscribe((data) => {
      this.parseData(data)
    }, error => {
      console.error(error);
    })
  }

  private parseData(data: HistoricalPrice[]) {
    for(let index = 0; index < data.length; index++) {
      let obj = data[index];
      let date = new Date(obj.date);
      let price = obj.close;
      if (date < new Date('2021-10-01')) {
        price /= 1000000;
      }
      if (date < new Date('2018-08-20')) {
        price /= 100000;
      }
      data[index].close = price;
    }
    console.info(data);
    let dataFrame = new danfo.DataFrame(data);
    dataFrame.print()
  }

}
