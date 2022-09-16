import {InjectionToken, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import {ComponentsModule} from "./Components/components.module";
import {PagesModule} from "./Pages/pages.module";
import {HttpService} from "./Services/http.service";
import {HttpClientModule} from "@angular/common/http";

export const API = new InjectionToken<string>('API');

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    ComponentsModule,
    PagesModule,
    HttpClientModule,
    StoreModule.forRoot({}, {})
  ],
  providers: [{ provide: API, useValue: "http://localhost:5094" }, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }


