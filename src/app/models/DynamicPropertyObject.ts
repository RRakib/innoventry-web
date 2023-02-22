export class DynamicPropertyObject {
  items : any = {};

  constructor() {
    this.items = {};
  }

  public has(key: string) {
    return key in this.items;
  }

  public set(key: string,value: any) {
    this.items[key] = value;
  }

  public get(key: string) {
    return this.items[key];
  }  
}