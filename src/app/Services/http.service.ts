import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {RectangleDimensionsRequestResponse} from "../Models/RectangleDimensionsRequestResponse";
import {API} from "../app.module";

@Injectable()

export class HttpService{
  constructor(private httpClient : HttpClient, @Inject(API) private api : string) {
  }

  getRectangleDimensions() : Observable<RectangleDimensionsRequestResponse>{
    return this.httpClient.get<RectangleDimensionsRequestResponse>(this.api + "/api/dimensions")
  }

  postRectangleDimensions(rectangleDimensions : RectangleDimensionsRequestResponse){
    return this.httpClient.post(this.api + "/api/dimensions", rectangleDimensions)
      .subscribe(_ => {
        console.log("Saved")
      })
  }
}
