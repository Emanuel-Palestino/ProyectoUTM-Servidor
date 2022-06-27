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
        this.router.get('/listMateriasByCarreraByPeriodo/:idCarrera/:idPeriodo', MateriasController_1.materiasController.listMateriasByCarreraByPeriodo);
        this.router.get('/listMateriasByAnyoByPeriodo/:idProfesor/:anyoIni/:anyoFin', MateriasController_1.materiasController.listMateriasByAnyoByPeriodo);
        this.router.get('/listMateriasByAnyoByPeriodoMultiple/:idProfesor/:anyoIni/:anyoFin', MateriasController_1.materiasController.listMateriasByAnyoByPeriodoMultiple);
        this.router.get('/listMateriasByPlanBySemestreByPeriodo/:idPlan/:semestre/:AnyoI/:AnyoF', MateriasController_1.materiasController.listMateriasByPlanBySemestreByPeriodo);
        this.router.get('/listMateriasMultiasignacionByPeriodoByProfesor/:idPeriodo/:idProfesor', MateriasController_1.materiasController.listMateriasMultiasignacionByPeriodoByProfesor);
    }
}
const materiasRouter = new MateriasRouter();
exports.default = materiasRouter.router;
