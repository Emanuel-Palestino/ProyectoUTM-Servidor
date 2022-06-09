"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PlanesController_1 = require("../controllers/PlanesController");
class PlanesRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', PlanesController_1.planesController.list);
        this.router.get('/:id', PlanesController_1.planesController.listOne);
        this.router.post('/create', PlanesController_1.planesController.create);
        this.router.delete('/delete/:idMateria', PlanesController_1.planesController.delete);
        this.router.put('/update/:idMateria', PlanesController_1.planesController.update);
        this.router.get('/planesByCarrera', PlanesController_1.planesController.getPlanesByCarrera);
    }
}
const planesRoutes = new PlanesRoutes();
exports.default = planesRoutes.router;
