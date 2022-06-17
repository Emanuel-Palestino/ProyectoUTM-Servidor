"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProyectosController_1 = require("../controllers/ProyectosController");
class ProyectoRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', ProyectosController_1.proyectosController.list);
        this.router.get('/:idProyecto', ProyectosController_1.proyectosController.listOne);
        this.router.post('/create', ProyectosController_1.proyectosController.create);
        this.router.delete('/delete/:idProyecto', ProyectosController_1.proyectosController.delete);
        this.router.put('/update/:idProyecto', ProyectosController_1.proyectosController.update);
        this.router.get('/listProyectosByProfesorByPeriodo/:idProfesor/:fechaIni/:fechaFin', ProyectosController_1.proyectosController.listProyectosByProfesorByPeriodo);
        this.router.get('/listColaboradoresInternosProyectos/:idProfesor', ProyectosController_1.proyectosController.listColaboradoresInternosProyectos);
    }
}
const proyectoRoutes = new ProyectoRoutes();
exports.default = proyectoRoutes.router;
