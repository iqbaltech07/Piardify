import { getCardTemplate } from "./card.js";
import { getHeroTemplate } from "./hero.js";
import { getTableTemplate } from "./table.js";
import { getFormTemplate } from "./form.js";
import { getModalTemplate } from "./modal.js";
import { getBentoTemplate } from "./bento.js";
export type ComponentType = "card" | "hero" | "table" | "form" | "modal" | "bento" | "sidebar";
export declare function getScaffoldTemplate(name: string, type: ComponentType): string;
export { getCardTemplate, getHeroTemplate, getTableTemplate, getFormTemplate, getModalTemplate, getBentoTemplate, };
