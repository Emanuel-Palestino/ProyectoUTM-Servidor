"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TipoProfesorController_1 = require("../controllers/TipoProfesorController");
class ProfesoresRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', TipoProfesorController_1.tipoProfesorController.list);
        this.router.get('/:id', TipoProfesorController_1.tipoProfesorController.listOne);
        this.router.post('/create', TipoProfesorController_1.tipoProfesorController.create);
        this.router.delete('/delete/:idTipoProfesor', TipoProfesorController_1.tipoProfesorController.delete);
        this.router.put('/update/:idTipoProfesor', TipoProfesorController_1.tipoProfesorController.update);
    }
}
const profesoresRoutes = new ProfesoresRoutes();
exports.default = profesoresRoutes.router;
