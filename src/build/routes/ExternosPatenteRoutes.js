"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ExternosPatenteController_1 = require("../controllers/ExternosPatenteController");
class ExternosPatenteRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', ExternosPatenteController_1.externosPatenteController.list);
        this.router.get('/:id', ExternosPatenteController_1.externosPatenteController.listOne);
        this.router.post('/create', ExternosPatenteController_1.externosPatenteController.create);
        this.router.delete('/delete/:id', ExternosPatenteController_1.externosPatenteController.delete);
        this.router.put('/actualizar/:idExternoPatente', ExternosPatenteController_1.externosPatenteController.actualizar);
    }
}
const externosPatenteRoutes = new ExternosPatenteRoutes();
exports.default = externosPatenteRoutes.router;
