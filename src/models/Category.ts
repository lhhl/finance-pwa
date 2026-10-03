import { CAT_ICON_PATH } from "../constants";

export class Category {
  id: string;
  name: string;
  icon: string;
  iconUrl?: string;

  constructor(category: Category) {
    const { id, name, icon } = category;
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.iconUrl = icon ? `${CAT_ICON_PATH}/${icon}` : undefined;
  }
}