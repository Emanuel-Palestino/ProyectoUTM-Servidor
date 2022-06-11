"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patentesController_1 = require("../controllers/patentesController");
class PatentesRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', patentesController_1.patentesController.list);
        this.router.get('/:id', patentesController_1.patentesController.listOne);
        this.router.post('/create', patentesController_1.patentesController.create);
        this.router.delete('/delete/:id', patentesController_1.patentesController.delete);
        this.router.put('/actualizar/:id', patentesController_1.patentesController.actualizar);
    }
}
const patentesRoutes = new PatentesRoutes();
exports.default = patentesRoutes.router;
