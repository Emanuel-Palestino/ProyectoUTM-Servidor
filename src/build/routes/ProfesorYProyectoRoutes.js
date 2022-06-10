"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProfesorYProyectoController_1 = require("../controllers/ProfesorYProyectoController");
class ProfesorYProyecto {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', ProfesorYProyectoController_1.profesorYProyectoController.list);
        this.router.get('/:idProyecto/:idProfesor', ProfesorYProyectoController_1.profesorYProyectoController.listOne);
        this.router.post('/create', ProfesorYProyectoController_1.profesorYProyectoController.create);
        this.router.delete('/delete/:idProyecto/:idProfesor', ProfesorYProyectoController_1.profesorYProyectoController.delete);
        this.router.put('/update/:idProyecto/:idProfesor', ProfesorYProyectoController_1.profesorYProyectoController.update);
    }
}
const profesorYProyectoRoutes = new ProfesorYProyecto();
exports.default = profesorYProyectoRoutes.router;
