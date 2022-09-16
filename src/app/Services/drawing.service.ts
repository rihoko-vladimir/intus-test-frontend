import {Injectable} from "@angular/core";
import {Circle, Rect, SVG} from "@svgdotjs/svg.js";
import {G, Text} from "@svgdotjs/svg.js";
import {HttpService} from "./http.service";

@Injectable()

export class DrawingService {

  constructor(private httpService : HttpService) {
  }

  private resizeGridMargin = 8;

  addResizeGrid(element: Rect, addTo: G, groupElement: G, rectangle: Rect, textElement: Text, draggable: G) {

    function getResizePoint(x: number, y: number): Circle {
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

    topLeftCircle.attr({cursor: 'nw-resize'})

    this.addTopLeftListener(topLeftCircle, groupElement, rectangle, textElement)

    const topRightCircle = getResizePoint(topRightX, topRightY)

    topRightCircle.attr({cursor: 'ne-resize'})

    this.addTopRightListener(topRightCircle, groupElement, rectangle, textElement, draggable)

    const bottomLeftCircle = getResizePoint(bottomLeftX, bottomLeftY)

    bottomLeftCircle.attr({cursor: 'sw-resize'})

    this.addBottomLeftListener(bottomLeftCircle, groupElement, rectangle, textElement, draggable)

    const bottomRightCircle = getResizePoint(bottomRightX, bottomRightY)

    bottomRightCircle.attr({cursor: 'se-resize'})

    this.addBottomRightListener(bottomRightCircle, groupElement, rectangle, textElement, draggable)

    addTo.add(polyLine)

    addTo.add(topLeftCircle)
    addTo.add(topRightCircle)
    addTo.add(bottomLeftCircle)
    addTo.add(bottomRightCircle)
  }

  private updatePerimeterInfo(perimeterInfo: Text, newPerimeter: number) {
    perimeterInfo.text(`Perimeter is ${newPerimeter}`)
  }

  private addTopLeftListener(topLeftCircle: Circle, groupElement: G, rectangle: Rect, textElement: Text) {
    let x: number
    let y: number
    let width: number
    let height: number

    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault()

      if (event.clientX < x) {
        const newWidth = width + (x - event.clientX)

        if (newWidth < 100)
          return

        groupElement.x(event.clientX)
        groupElement.width(newWidth)
      }

      if (event.clientX > x) {
        const newWidth = width - (event.clientX - x)

        if (newWidth < 100)
          return

        groupElement.x(event.clientX)
        groupElement.width(newWidth)
      }

      if (event.clientY < y) {
        const newHeight = height + (y - event.clientY)

        if (newHeight < 100)
          return

        groupElement.y(event.clientY)
        groupElement.height(newHeight)
      }

      if (event.clientY > y) {
        const newHeight = height - (event.clientY - y)

        if (newHeight < 100)
          return

        groupElement.y(event.clientY)
        groupElement.height(newHeight)
      }

      const rectWidth = rectangle.node.getBoundingClientRect().width
      const rectHeight = rectangle.node.getBoundingClientRect().height

      this.updatePerimeterInfo(textElement, rectWidth + rectHeight)
    }

    const onMouseUp = (event: MouseEvent) => {
      event.preventDefault()
      // @ts-ignore
      window.removeEventListener("onmousemove", onMouseMove)
      window.onmousemove = null

      const rectWidth = rectangle.node.getBoundingClientRect().width
      const rectHeight = rectangle.node.getBoundingClientRect().height
      x = groupElement.x() as number
      y = groupElement.y() as number
      this.updateDimensions(x, y, rectWidth, rectHeight)
    }

    const onMouseDown = (event: MouseEvent) => {
      event.preventDefault()
      x = groupElement.x() as number
      y = groupElement.y() as number
      width = groupElement.width() as number
      height = groupElement.height() as number

      window.onmousemove = onMouseMove

      window.onmouseup = onMouseUp
    }

    topLeftCircle.node.onmousedown = onMouseDown
  }

  private addTopRightListener(topRightCircle: Circle, groupElement: G, rectangle: Rect, textElement: Text, draggable: G) {
    let x: number
    let y: number
    let width: number
    let height: number

    const onMouseMove = (event: any) => {
      event.preventDefault()


      if (event.clientX > x + width) {
        const newWidth = event.clientX - x

        if (newWidth < 100)
          return

        groupElement.x(x)
        groupElement.width(newWidth)
      }

      if (event.clientX < x + width) {
        const newWidth = event.clientX - x

        if (newWidth < 100)
          return

        groupElement.x(x)
        groupElement.width(newWidth)
      }

      if (event.clientY < y) {
        const newHeight = y - event.clientY + height

        if (newHeight < 100)
          return

        groupElement.y(event.clientY)
        groupElement.height(newHeight)
      }

      if (event.clientY > y) {
        const newHeight = height - (event.clientY - y)

        if (newHeight < 100)
          return

        groupElement.y(event.clientY)
        groupElement.height(newHeight)
      }

      const rectWidth = rectangle.node.getBoundingClientRect().width
      const rectHeight = rectangle.node.getBoundingClientRect().height

      this.updatePerimeterInfo(textElement, rectWidth + rectHeight)
    }

    const onMouseUp = (event: MouseEvent) => {
      event.preventDefault()
      window.removeEventListener("onmousemove", onMouseMove)
      draggable.off("beforedrag dragmove")
      window.onmousemove = null
      const rectWidth = rectangle.node.getBoundingClientRect().width
      const rectHeight = rectangle.node.getBoundingClientRect().height
      x = groupElement.x() as number
      y = groupElement.y() as number
      this.updateDimensions(x, y, rectWidth, rectHeight)
    }

    const onMouseDown = (event: MouseEvent) => {
      draggable.on("beforedrag dragmove", (event) => {
        event.preventDefault()
      })
      event.preventDefault()
      x = groupElement.x() as number
      y = groupElement.y() as number
      width = groupElement.width() as number
      height = groupElement.height() as number

      window.onmousemove = onMouseMove

      window.onmouseup = onMouseUp
    }

    topRightCircle.node.onmousedown = onMouseDown
  }

  private addBottomLeftListener(bottomLeftCircle: Circle, groupElement: G, rectangle: Rect, textElement: Text, draggable: G) {
    let x: number
    let y: number
    let width: number
    let height: number

    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault()

      if (event.clientX < x) {
        const newWidth = width + (x - event.clientX)

        if (newWidth < 100)
          return

        groupElement.x(event.clientX)
        groupElement.width(newWidth)
      }

      if (event.clientX > x) {
        const newWidth = width - (event.clientX - x)

        if (newWidth < 100)
          return

        groupElement.x(event.clientX)
        groupElement.width(newWidth)
      }

      if (event.clientY < y + height) {
        const newHeight = event.clientY - y

        if (newHeight < 100)
          return

        groupElement.y(y)
        groupElement.height(newHeight)
      }

      if (event.clientY > y + height) {
        const newHeight = event.clientY - y

        if (newHeight < 100)
          return

        groupElement.y(y)
        groupElement.height(newHeight)
      }

      const rectWidth = rectangle.node.getBoundingClientRect().width
      const rectHeight = rectangle.node.getBoundingClientRect().height

      this.updatePerimeterInfo(textElement, rectWidth + rectHeight)
    }

    const onMouseUp = (event: MouseEvent) => {
      event.preventDefault()
      // @ts-ignore
      window.removeEventListener("onmousemove", onMouseMove)
      draggable.off("beforedrag dragmove")
      window.onmousemove = null
      const rectWidth = rectangle.node.getBoundingClientRect().width
      const rectHeight = rectangle.node.getBoundingClientRect().height
      x = groupElement.x() as number
      y = groupElement.y() as number
      this.updateDimensions(x, y, rectWidth, rectHeight)
    }

    const onMouseDown = (event: MouseEvent) => {
      event.preventDefault()
      draggable.on("beforedrag dragmove", (event) => {
        event.preventDefault()
      })
      x = groupElement.x() as number
      y = groupElement.y() as number
      width = groupElement.width() as number
      height = groupElement.height() as number

      window.onmousemove = onMouseMove

      window.onmouseup = onMouseUp
    }

    bottomLeftCircle.node.onmousedown = onMouseDown
  }

  private addBottomRightListener(bottomRightCircle: Circle, groupElement: G, rectangle: Rect, textElement: Text, draggable: G) {
    let x: number
    let y: number
    let width: number
    let height: number

    const onMouseMove = (event: any) => {
      event.preventDefault()


      if (event.clientX > x + width) {
        const newWidth = event.clientX - x

        if (newWidth < 100)
          return

        groupElement.x(x)
        groupElement.width(newWidth)
      }

      if (event.clientX < x + width) {
        const newWidth = event.clientX - x

        if (newWidth < 100)
          return

        groupElement.x(x)
        groupElement.width(newWidth)
      }

      if (event.clientY < y + height) {
        const newHeight = event.clientY - y

        if (newHeight < 100)
          return

        groupElement.y(y)
        groupElement.height(newHeight)
      }

      if (event.clientY > y + height) {
        const newHeight = event.clientY - y

        if (newHeight < 100)
          return

        groupElement.y(y)
        groupElement.height(newHeight)
      }

      const rectWidth = rectangle.node.getBoundingClientRect().width
      const rectHeight = rectangle.node.getBoundingClientRect().height

      this.updatePerimeterInfo(textElement, rectWidth + rectHeight)
    }

    const onMouseUp = (event: MouseEvent) => {
      event.preventDefault()
      window.removeEventListener("onmousemove", onMouseMove)
      draggable.off("beforedrag dragmove")
      window.onmousemove = null
      const rectWidth = rectangle.node.getBoundingClientRect().width
      const rectHeight = rectangle.node.getBoundingClientRect().height
      x = groupElement.x() as number
      y = groupElement.y() as number
      this.updateDimensions(x, y, rectWidth, rectHeight)
    }

    const onMouseDown = (event: MouseEvent) => {
      draggable.on("beforedrag dragmove", (event) => {
        event.preventDefault()
      })
      event.preventDefault()
      x = groupElement.x() as number
      y = groupElement.y() as number
      width = groupElement.width() as number
      height = groupElement.height() as number

      window.onmousemove = onMouseMove

      window.onmouseup = onMouseUp
    }

    bottomRightCircle.node.onmousedown = onMouseDown
  }

  private updateDimensions(x : number, y : number, width : number, height : number){
    this.httpService.postRectangleDimensions({x, y, width, height})
  }
}
