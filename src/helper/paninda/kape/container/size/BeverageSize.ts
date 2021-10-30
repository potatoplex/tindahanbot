export default abstract class BeverageSize {
  private _name: string;
  private _scale: number;

  constructor(name: string, scale: number) {
    this._name = name;
    this._scale = scale;
  }

  getDescription(): string {
    return this.name;
  }

  getSize(): BeverageSize {
    return this;
  }

  public get name(): string {
    return this._name;
  }

  public get scale(): number {
    return this._scale;
  }
}
