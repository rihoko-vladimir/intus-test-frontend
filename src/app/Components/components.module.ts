import {NgModule} from "@angular/core";
import {CanvasComponent} from "./Canvas/canvas.component";
import {DrawingService} from "../Services/drawing.service";

@NgModule({
  exports: [
    CanvasComponent
  ],
  providers: [DrawingService],
  declarations: [CanvasComponent]
})

export class ComponentsModule {}
