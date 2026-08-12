import { getCardTemplate } from "./card.js";
import { getHeroTemplate } from "./hero.js";
import { getTableTemplate } from "./table.js";
import { getFormTemplate } from "./form.js";
import { getModalTemplate } from "./modal.js";
import { getBentoTemplate } from "./bento.js";

export type ComponentType = "card" | "hero" | "table" | "form" | "modal" | "bento" | "sidebar";

export function getScaffoldTemplate(name: string, type: ComponentType): string {
  switch (type) {
    case "hero":
      return getHeroTemplate(name);
    case "table":
      return getTableTemplate(name);
    case "form":
      return getFormTemplate(name);
    case "modal":
      return getModalTemplate(name);
    case "bento":
      return getBentoTemplate(name);
    case "card":
    default:
      return getCardTemplate(name);
  }
}

export {
  getCardTemplate,
  getHeroTemplate,
  getTableTemplate,
  getFormTemplate,
  getModalTemplate,
  getBentoTemplate,
};
