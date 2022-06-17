"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PlanController_1 = require("../controllers/PlanController");
class PlanRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/create', PlanController_1.planControllers.create);
        this.router.get('/', PlanController_1.planControllers.list);
        this.router.get('/:id', PlanController_1.planControllers.listOne);
        this.router.delete('/delete/:id', PlanController_1.planControllers.delete);
        this.router.put('/actualizar/:id', PlanController_1.planControllers.actualizar);
    }
}
const planRoutes = new PlanRoutes();
exports.default = planRoutes.router;
