import { Image, loadImage } from "canvas";
import NodeCache from "node-cache";
import axios from "axios";

const defaultTTL = 300;
const cache = new NodeCache({ stdTTL: defaultTTL });

export async function getImage(url: string): Promise<Image> {
  const key = `img_${url}`;
  const img = cache.get<Buffer>(key);

  if (!img) {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    cache.set(key, response.data);
    return await loadImage(response.data);
  }

  return await loadImage(img);
}

export async function getValue<T>(
  key: string,
  cb: () => Promise<T>,
  ttl?: number
): Promise<T> {
  const value = cache.get<T>(key);

  if (!value) {
    const v = await cb();
    cache.set(key, v, ttl || defaultTTL);
    return v;
  }

  return value;
}
