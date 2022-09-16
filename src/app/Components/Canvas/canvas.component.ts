import {Component, OnDestroy, OnInit} from "@angular/core";
import {Circle, Svg} from "@svgdotjs/svg.js";
import {SVG} from '@svgdotjs/svg.js'
import '@svgdotjs/svg.panzoom.js'
import '@svgdotjs/svg.draggable.js'
import {Rect} from "@svgdotjs/svg.js";
import {G} from "@svgdotjs/svg.js";
import { Element } from "@svgdotjs/svg.js";


@Component({
  selector: "canvas-component",
  styleUrls: ["canvas.component.css"],
  templateUrl: "canvas.component.html"
})

export class CanvasComponent implements OnInit, OnDestroy {
  canvas!: Svg;
  rectangle!: Rect;
  groupWithPinButtons!: G;

  private resizeGridMargin = 8;

  private textMargin = 32;
  private perimeterInfo!: Element;

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

    this.addResizeGrid(this.rectangle)

    this.groupWithPinButtons.add(this.rectangle)

    this.addPerimeterInfoText(this.groupWithPinButtons)

    this.groupWithPinButtons.draggable()

    this.canvas.add(this.groupWithPinButtons)


    this.addListeners()
  }

  ngOnDestroy(): void {
    this.rectangle.off("dragmove.namespace")
  }

  private addListeners() {
    this.groupWithPinButtons.on("dragmove.namespace", (event: any) => {
      const box = event.detail.box

      let {x, y} = box

      const width = this.canvas.node.width.baseVal.value

      const height = this.canvas.node.height.baseVal.value

      if (x <= 0 || y <= 0 || (x + box.w) >= width || (y + box.h) >= height) {
        event.preventDefault()
      }
    })
  }

  private addResizeGrid(element : Rect){

    function getResizePoint(x : number, y : number) : Circle{
      return SVG()
        .circle(12)
        .move(x - 6, y - 6)
    }

    const topLeftX = (element.x() as number) - this.resizeGridMargin
    const topLeftY = (element.y() as number) - this.resizeGridMargin
    const topRightX = topLeftX + (element.width() as number) + this.resizeGridMargin * 2
    const topRightY = topLeftY
    const bottomLeftX = topLeftX
    const bottomLeftY = topLeftY + (element.height() as number) + 2 * this.resizeGridMargin
    const bottomRightX = topRightX
    const bottomRightY = bottomLeftY

    const polyLine = SVG()
      .polyline([
        [topLeftX, topLeftY],
        [topRightX, topRightY],
        [bottomRightX, bottomRightY],
        [bottomLeftX, bottomLeftY],
        [topLeftX, topLeftY]])
      .fill("none")
      .stroke({color: '#f06', width: 4, linecap: 'round', linejoin: 'round'})

    const topLeftCircle = getResizePoint(topLeftX, topLeftY)

    topLeftCircle.attr({cursor : 'nw-resize'})

    const topRightCircle = getResizePoint(topRightX, topRightY)

    topRightCircle.attr({cursor : 'ne-resize'})

    const bottomLeftCircle = getResizePoint(bottomRightX, bottomRightY)

    bottomLeftCircle.attr({cursor : 'se-resize'})

    const bottomRightCircle = getResizePoint(bottomLeftX, bottomLeftY)

    bottomRightCircle.attr({cursor : 'sw-resize'})

    this.groupWithPinButtons.add(polyLine)

    this.groupWithPinButtons.add(topLeftCircle)
    this.groupWithPinButtons.add(topRightCircle)
    this.groupWithPinButtons.add(bottomLeftCircle)
    this.groupWithPinButtons.add(bottomRightCircle)
  }

  private addPerimeterInfoText(element : G){
    const rectanglePerimeter = (this.rectangle.width() as number) * (this.rectangle.height() as number)
    this.perimeterInfo = SVG()
      .text(`Perimeter is ${rectanglePerimeter}`)
      .move(
        (element.width() as number) + this.textMargin,
        (element.y() as number) + (element.height() as number) / 2)

    element.add(this.perimeterInfo)
  }

}
