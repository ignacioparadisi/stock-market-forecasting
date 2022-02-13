import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HistoricalPrice} from "../models/HistoricalPrice";

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  constructor(private http: HttpClient) { }

  getData(title: string) {
    let url = `https://sandbox.iexapis.com/stable/stock/${title}/chart/max?token=Tpk_7ef63a0d0ca94395a15d73c3fd314f0e`
    return this.http.get<HistoricalPrice[]>(url);
  }
}
