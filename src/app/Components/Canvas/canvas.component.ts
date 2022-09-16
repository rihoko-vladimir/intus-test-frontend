import {Component, OnDestroy, OnInit} from "@angular/core";
import {Svg} from "@svgdotjs/svg.js";
import {SVG} from '@svgdotjs/svg.js'
import '@svgdotjs/svg.panzoom.js'
import '@svgdotjs/svg.draggable.js'
import {Rect} from "@svgdotjs/svg.js";
import {G, Text} from "@svgdotjs/svg.js";
import {DrawingService} from "../../Services/drawing.service";
import {HttpClient} from "@angular/common/http";
import {HttpService} from "../../Services/http.service";
import { Observable, Subscription} from "rxjs";
import {RectangleDimensionsRequestResponse} from "src/app/Models/RectangleDimensionsRequestResponse";


@Component({
  selector: "canvas-component",
  styleUrls: ["canvas.component.css"],
  templateUrl: "canvas.component.html"
})

export class CanvasComponent implements OnInit, OnDestroy {
  canvas!: Svg;
  rectangle!: Rect;
  groupWithPinButtons!: G;

  private dimensionsSubscription!: Subscription;


  private perimeterInfo!: Text;
  private draggable!: G;

  constructor(private drawingService: DrawingService, private httpService : HttpService) {
  }

  ngOnInit(): void {
    this.dimensionsSubscription = this.httpService.getRectangleDimensions().subscribe(dimensions => {
      this.initCanvas(dimensions)
    })
  }

  ngOnDestroy(): void {
    this.rectangle.off("dragmove.namespace")
    this.dimensionsSubscription.unsubscribe()
  }

  initCanvas(dimensions : RectangleDimensionsRequestResponse){
    const width = "100%"

    const height = "100%"

    this.canvas = SVG()
      .addTo("#drawing-canvas")
      .size(width, height);

    this.groupWithPinButtons = SVG().group()

    this.rectangle = SVG()
      .rect(dimensions.width, dimensions.height)
      .move(dimensions.x, dimensions.y)
      .fill('rgba(0,0,0,0.34)')

    this.addPerimeterInfoText(this.canvas)

    this.draggable = this.groupWithPinButtons.draggable()

    this.drawingService.addResizeGrid(this.rectangle, this.groupWithPinButtons, this.groupWithPinButtons, this.rectangle, this.perimeterInfo, this.draggable)

    this.groupWithPinButtons.add(this.rectangle)

    this.canvas.add(this.groupWithPinButtons)
  }


  private addPerimeterInfoText(element: Svg) {
    const rectanglePerimeter = (this.rectangle.width() as number) + (this.rectangle.height() as number)
    this.perimeterInfo = SVG()
      .text(`Perimeter is ${rectanglePerimeter}`)
      .move(48, 48)

    element.add(this.perimeterInfo)
  }


}
