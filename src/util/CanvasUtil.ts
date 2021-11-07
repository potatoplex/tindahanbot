import {
  Canvas,
  createCanvas,
  Image,
  NodeCanvasRenderingContext2D,
} from "canvas";

export function fillRect(
  ctx: NodeCanvasRenderingContext2D,
  x1: number,
  y1: number,
  width: number,
  height: number,
  color: string,
  angle = 0
): Canvas {
  const canvas = createCanvas(width, height);
  const ctx2 = canvas.getContext("2d");

  ctx2.save();
  ctx2.fillStyle = color;
  ctx2.fillRect(0, 0, canvas.width, canvas.height);
  ctx2.restore();
  const c = angle ? rotateDrawing(canvas, angle) : canvas;
  ctx.drawImage(c, x1, y1, width, height);

  return c;
}

export function strokeRect(
  ctx: NodeCanvasRenderingContext2D,
  x1: number,
  y1: number,
  width: number,
  height: number,
  color: string
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.strokeRect(x1, y1, width, height);
  ctx.restore();
}

export function drawCircle(
  ctx: NodeCanvasRenderingContext2D,
  x1: number,
  y1: number,
  width: number,
  height: number,
  color: string
): void {
  ctx.save();
  ctx.beginPath();
  ctx.arc(
    x1 + width * 0.5,
    y1 + height * 0.5,
    width * 0.5,
    0,
    Math.PI * 2,
    true
  );
  ctx.closePath();
  ctx.clip();
  ctx.restore();
}
export function fillCircle(
  ctx: NodeCanvasRenderingContext2D,
  x1: number,
  y1: number,
  width: number,
  height: number,
  color: string
): void {
  drawCircle(ctx, x1, y1, width, height, color);
  ctx.save();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}
export function strokeCircle(
  ctx: NodeCanvasRenderingContext2D,
  x1: number,
  y1: number,
  width: number,
  height: number,
  color: string
): void {
  drawCircle(ctx, x1, y1, width, height, color);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.restore();
}

export function rotateDrawing(
  img: Image | Canvas,
  angle: number,
  padding = 1.2
): Canvas {
  const p = angle ? padding : 0;
  const canvas = createCanvas(img.width * p, img.height * padding);
  const ctx = canvas.getContext("2d");
  ctx.save();
  const origin = {
    x: canvas.width * 0.5,
    y: canvas.height * 0.5,
  };
  ctx.translate(origin.x, origin.y);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.drawImage(
    img,
    -origin.x + (canvas.width - img.width) * 0.5,
    -origin.y + (canvas.height - img.height) * 0.5,
    img.width,
    img.height
  );
  ctx.restore();

  return canvas;
}
