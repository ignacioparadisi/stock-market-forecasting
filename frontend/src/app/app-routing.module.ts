import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PredictionComponent} from "./prediction/prediction.component";

const routes: Routes = [
  { path: '', redirectTo: 'prediction', pathMatch: 'full' },
  { path: 'prediction', component: PredictionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
