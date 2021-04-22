import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';
import { MessageAttachment } from 'discord.js';

export type Coordinates = {
	x: number;
	y: number;
};
export type Dimensions = {
	width: number;
	height: number;
};

export class ImageEntry {
	constructor(
		public image: string,
		public dimensions: Dimensions,
		public coordinates: Coordinates,
		public round: boolean = false
	) {}

	roundCorners(
		ctx: CanvasRenderingContext2D,
		coordinates: Coordinates,
		dimensions: Dimensions
	) {
		const { x, y } = coordinates;
		const { width, height } = dimensions;
		ctx.beginPath();
		ctx.arc(
			x + width * 0.5,
			y + height * 0.5,
			width * 0.5,
			0,
			Math.PI * 2,
			true
		);
		ctx.closePath();
		ctx.clip();
	}

	getScaledCoords(containerDims: Dimensions): Coordinates {
		const { width: cWidth, height: cHeight } = containerDims;
		const { x: pX, y: pY } = this.coordinates;
		const x = pX * cWidth;
		const y = pY * cHeight;
		return { x, y };
	}

	async render(
		ctx: CanvasRenderingContext2D,
		containerDims: Dimensions
	): Promise<void> {
		if (this.round) {
			await this.roundCorners(ctx, this.coordinates, this.dimensions);
		}
		const { width, height } = this.dimensions;
		const { x, y } = this.getScaledCoords(containerDims);

		const image = await loadImage(this.image);
		ctx.drawImage(image, x, y, width, height);
	}
}

export default class ImageBuilder {
	constructor(
		public dimensions: Dimensions,
		public images: ImageEntry[],
		public background?: string
	) {}

	async render(): Promise<MessageAttachment> {
		const { width: WIDTH, height: HEIGHT } = this.dimensions;
		const canvas = createCanvas(WIDTH, HEIGHT);
		const ctx = canvas.getContext('2d');

		if (this.background) {
			const image = await loadImage(this.background);
			ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
		}

		for (const image of this.images) {
			ctx.save();
			await image.render(ctx, this.dimensions);
			ctx.restore();
		}

		const attachment = new MessageAttachment(canvas.toBuffer(), 'img.png');
		return attachment;
	}
}
