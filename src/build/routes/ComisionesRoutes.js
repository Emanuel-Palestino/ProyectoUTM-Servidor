"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ComisionesController_1 = require("../controllers/ComisionesController");
class ComisionesRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/listarComisionesSinAsignar', ComisionesController_1.comisionesController.listarComisionesSinAsignar);
        this.router.get('/', ComisionesController_1.comisionesController.list);
        this.router.get('/:idComision', ComisionesController_1.comisionesController.listOne);
        this.router.post('/create', ComisionesController_1.comisionesController.create);
        this.router.put('/update/:idComision', ComisionesController_1.comisionesController.update);
        this.router.delete('/delete/:idComision', ComisionesController_1.comisionesController.delete);
        this.router.get('/listComisionesByProfesorByPeriodo/:idProfesor/:fechaIni/:fechaFin', ComisionesController_1.comisionesController.listComisionesByProfesoByPeriodo);
        this.router.get('/listComisionesByCarreraByPeriodo/:idCarrera/:fechaIni/:fechaFin', ComisionesController_1.comisionesController.listComisionesByCarreraByPeriodo);
    }
}
const comisionesRoutes = new ComisionesRoutes();
exports.default = comisionesRoutes.router;
