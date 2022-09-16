import {NgModule} from "@angular/core";
import {CanvasPageComponent} from "./Canvas/canvas-page.component";
import {ComponentsModule} from "../Components/components.module";

@NgModule({
  declarations: [CanvasPageComponent],
  exports: [
    CanvasPageComponent
  ],
  imports: [ComponentsModule]
})

export class PagesModule {}
