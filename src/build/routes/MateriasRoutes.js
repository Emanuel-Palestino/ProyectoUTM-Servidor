"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MateriasController_1 = require("../controllers/MateriasController");
class MateriasRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', MateriasController_1.materiasController.list);
        this.router.get('/:id', MateriasController_1.materiasController.listOne);
        this.router.post('/create', MateriasController_1.materiasController.create);
        this.router.delete('/delete/:idMateria', MateriasController_1.materiasController.delete);
        this.router.put('/update/:idMateria', MateriasController_1.materiasController.update);
        this.router.get('/materiasByCarrera', MateriasController_1.materiasController.getMateriasByCarrera);
    }
}
const materiasRoutes = new MateriasRoutes();
exports.default = materiasRoutes.router;
