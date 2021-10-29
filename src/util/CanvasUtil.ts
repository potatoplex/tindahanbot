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
  color: string
): void {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(x1, y1, width, height);
  ctx.restore();
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

export function rotateImg(img: Image, angle: number): Canvas {
  const padding = 0.2;
  const canvas = createCanvas(
    img.width * (1 + padding),
    img.height * (1 + padding)
  );
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
