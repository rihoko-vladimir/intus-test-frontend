import {NgModule} from "@angular/core";
import {CanvasPageComponent} from "./Canvas/canvas-page.component";
import {ComponentsModule} from "../Components/components.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [CanvasPageComponent],
  exports: [
    CanvasPageComponent
  ],
  imports: [ComponentsModule]
})

export class PagesModule {}
