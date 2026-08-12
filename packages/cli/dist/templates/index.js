"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBentoTemplate = exports.getModalTemplate = exports.getFormTemplate = exports.getTableTemplate = exports.getHeroTemplate = exports.getCardTemplate = void 0;
exports.getScaffoldTemplate = getScaffoldTemplate;
const card_js_1 = require("./card.js");
Object.defineProperty(exports, "getCardTemplate", { enumerable: true, get: function () { return card_js_1.getCardTemplate; } });
const hero_js_1 = require("./hero.js");
Object.defineProperty(exports, "getHeroTemplate", { enumerable: true, get: function () { return hero_js_1.getHeroTemplate; } });
const table_js_1 = require("./table.js");
Object.defineProperty(exports, "getTableTemplate", { enumerable: true, get: function () { return table_js_1.getTableTemplate; } });
const form_js_1 = require("./form.js");
Object.defineProperty(exports, "getFormTemplate", { enumerable: true, get: function () { return form_js_1.getFormTemplate; } });
const modal_js_1 = require("./modal.js");
Object.defineProperty(exports, "getModalTemplate", { enumerable: true, get: function () { return modal_js_1.getModalTemplate; } });
const bento_js_1 = require("./bento.js");
Object.defineProperty(exports, "getBentoTemplate", { enumerable: true, get: function () { return bento_js_1.getBentoTemplate; } });
function getScaffoldTemplate(name, type) {
    switch (type) {
        case "hero":
            return (0, hero_js_1.getHeroTemplate)(name);
        case "table":
            return (0, table_js_1.getTableTemplate)(name);
        case "form":
            return (0, form_js_1.getFormTemplate)(name);
        case "modal":
            return (0, modal_js_1.getModalTemplate)(name);
        case "bento":
            return (0, bento_js_1.getBentoTemplate)(name);
        case "card":
        default:
            return (0, card_js_1.getCardTemplate)(name);
    }
}
