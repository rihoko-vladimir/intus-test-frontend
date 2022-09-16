import {Component, OnDestroy, OnInit} from "@angular/core";
import {Svg} from "@svgdotjs/svg.js";
import {SVG} from '@svgdotjs/svg.js'
import '@svgdotjs/svg.panzoom.js'
import '@svgdotjs/svg.draggable.js'
import {Rect} from "@svgdotjs/svg.js";
import {G, Text} from "@svgdotjs/svg.js";
import {DrawingService} from "../../Services/drawing.service";


@Component({
  selector: "canvas-component",
  styleUrls: ["canvas.component.css"],
  templateUrl: "canvas.component.html"
})

export class CanvasComponent implements OnInit, OnDestroy {
  canvas!: Svg;
  rectangle!: Rect;
  groupWithPinButtons!: G;


  private perimeterInfo!: Text;
  private draggable!: G;

  constructor(private drawingService: DrawingService) {
  }

  ngOnInit(): void {
    const width = "100%"

    const height = "100%"

    this.canvas = SVG()
      .addTo("#drawing-canvas")
      .size(width, height);

    this.groupWithPinButtons = SVG().group()

    this.rectangle = SVG()
      .rect(500, 500)
      .move(32, 32)
      .fill('rgba(0,0,0,0.34)')

    this.addPerimeterInfoText(this.canvas)

    this.draggable = this.groupWithPinButtons.draggable()

    this.drawingService.addResizeGrid(this.rectangle, this.groupWithPinButtons, this.groupWithPinButtons, this.rectangle, this.perimeterInfo, this.draggable)

    this.groupWithPinButtons.add(this.rectangle)

    this.canvas.add(this.groupWithPinButtons)
  }

  ngOnDestroy(): void {
    this.rectangle.off("dragmove.namespace")
  }


  private addPerimeterInfoText(element: Svg) {
    const rectanglePerimeter = (this.rectangle.width() as number) + (this.rectangle.height() as number)
    this.perimeterInfo = SVG()
      .text(`Perimeter is ${rectanglePerimeter}`)
      .move(48, 48)

    element.add(this.perimeterInfo)
  }


}
