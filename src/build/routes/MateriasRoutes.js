"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MateriasController_1 = require("../controllers/MateriasController");
class MateriasRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/create', MateriasController_1.materiasController.create);
        this.router.get('/:idMateria', MateriasController_1.materiasController.listOne);
        this.router.get('/', MateriasController_1.materiasController.list);
        this.router.put('/update/:idMateria', MateriasController_1.materiasController.update);
        this.router.delete('/delete/:idMateria', MateriasController_1.materiasController.delete);
        this.router.get('/listMateriasMultiplesByCarreraByPeriodo/:idCarrera/:idPeriodo', MateriasController_1.materiasController.listMateriasMultiplesByCarreraByPeriodo);
        this.router.get('/listMateriasByAnyoByPeriodo/:idProfesor/:anyoIni/:anyoFin', MateriasController_1.materiasController.listMateriasByAnyoByPeriodo);
        this.router.get('/listMateriasByAnyoByPeriodoMultiple/:idProfesor/:anyoIni/:anyoFin', MateriasController_1.materiasController.listMateriasByAnyoByPeriodoMultiple);
    }
}
const materiasRouter = new MateriasRouter();
exports.default = materiasRouter.router;
