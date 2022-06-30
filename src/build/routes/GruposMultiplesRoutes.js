"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GruposMultiplesController_1 = require("../controllers/GruposMultiplesController");
class GruposMultiplesRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', GruposMultiplesController_1.gruposMultiplesController.list);
        this.router.post('/create', GruposMultiplesController_1.gruposMultiplesController.create);
        this.router.delete('/delete/:idCarrera', GruposMultiplesController_1.gruposMultiplesController.delete);
    }
}
const gruposMultiplesRoutes = new GruposMultiplesRoutes();
exports.default = gruposMultiplesRoutes.router;
