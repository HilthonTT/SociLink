export class Category {
    _id: string;
    name: string;
    description: string;
  
    constructor(name: string, description: string) {
      this._id = "";
      this.name = name;
      this.description = description;
    }
  }