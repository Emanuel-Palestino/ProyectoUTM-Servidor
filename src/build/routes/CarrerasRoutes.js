"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CarrerasController_1 = require("../controllers/CarrerasController");
class CarrerasRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', CarrerasController_1.carrerasController.list);
        this.router.get('/:idCarrera', CarrerasController_1.carrerasController.listOne);
        this.router.post('/create', CarrerasController_1.carrerasController.create);
        this.router.delete('/delete/:idCarrera', CarrerasController_1.carrerasController.delete);
        this.router.put('/update/:idCarrera', CarrerasController_1.carrerasController.update);
        this.router.get('/getCarrerasByInstituto/:idInstituto', CarrerasController_1.carrerasController.getCarrerasByInstituto);
    }
}
const carrerasRouter = new CarrerasRouter();
exports.default = carrerasRouter.router;
