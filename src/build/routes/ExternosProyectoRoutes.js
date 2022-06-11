"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ExternosProyectoController_1 = require("../controllers/ExternosProyectoController");
class ExternosProyectoRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', ExternosProyectoController_1.externosProyectoController.list);
        this.router.get('/:idExterno', ExternosProyectoController_1.externosProyectoController.listOne);
        this.router.post('/create', ExternosProyectoController_1.externosProyectoController.create);
        this.router.delete('/delete/:idExterno', ExternosProyectoController_1.externosProyectoController.delete);
        this.router.put('/update/:idExterno', ExternosProyectoController_1.externosProyectoController.update);
    }
}
const externosProyectoRoutes = new ExternosProyectoRoutes();
exports.default = externosProyectoRoutes.router;
