"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TutoradosController_1 = require("../controllers/TutoradosController");
class TutoradoRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', TutoradosController_1.tutoradoController.list);
        this.router.get('/:id', TutoradosController_1.tutoradoController.listOne);
        this.router.post('/create', TutoradosController_1.tutoradoController.create);
        this.router.delete('/delete/:id', TutoradosController_1.tutoradoController.delete);
        this.router.put('/actualizar/:idTutorado', TutoradosController_1.tutoradoController.actualizar);
        this.router.get('/listTutoradosByPeriodo/:idProfesor/:fechaIni/:fechaFin', TutoradosController_1.tutoradoController.listTutoradosByPeriodo);
        this.router.get('/listTutoradosByCarreraByPeriodo/:idCarrera/:fechaIni/:fechaFin', TutoradosController_1.tutoradoController.listTutoradosByCareraByPeriodo);
    }
}
const tutoradoRoutes = new TutoradoRoutes();
exports.default = tutoradoRoutes.router;
