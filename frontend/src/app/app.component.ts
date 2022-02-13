import { Component } from '@angular/core';
import * as danfo from 'danfojs';
import {DataServiceService} from "./data-service.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'stock-market-forecasting';
}