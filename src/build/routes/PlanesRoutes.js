"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PlanesController_1 = require("../controllers/PlanesController");
class PlanRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/create', PlanesController_1.planesController.create);
        this.router.get('/', PlanesController_1.planesController.list);
        this.router.get('/:id', PlanesController_1.planesController.listOne);
        this.router.delete('/delete/:id', PlanesController_1.planesController.delete);
        this.router.put('/actualizar/:id', PlanesController_1.planesController.actualizar);
    }
}
const planRoutes = new PlanRoutes();
exports.default = planRoutes.router;
