"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PatentesController_1 = require("../controllers/PatentesController");
class PatentesRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/create', PatentesController_1.patentesController.create);
        this.router.get('/', PatentesController_1.patentesController.list);
        this.router.get('/:id', PatentesController_1.patentesController.listOne);
        this.router.delete('/delete/:id', PatentesController_1.patentesController.delete);
        this.router.put('/actualizar/:id', PatentesController_1.patentesController.actualizar);
        this.router.get('/listColaboradoresInternosPatentes/:idProfesor', PatentesController_1.patentesController.listColaboradoresInternosPatentes);
        this.router.get('/listColaboradoresExternosPatentes/:idProfesor', PatentesController_1.patentesController.colaboradoresExternos);
    }
}
const patentesRoutes = new PatentesRoutes();
exports.default = patentesRoutes.router;
