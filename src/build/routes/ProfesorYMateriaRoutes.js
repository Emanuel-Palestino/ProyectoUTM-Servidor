"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProfesorYMateriaController_1 = require("../controllers/ProfesorYMateriaController");
class ProfesorYMateriaRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', ProfesorYMateriaController_1.profesorYMateriaController.list);
        this.router.get('/:idProfesorYMateria', ProfesorYMateriaController_1.profesorYMateriaController.listOne);
        this.router.post('/create', ProfesorYMateriaController_1.profesorYMateriaController.create);
        this.router.delete('/delete/:idProfesorYMateria', ProfesorYMateriaController_1.profesorYMateriaController.delete);
        this.router.put('/update/:idProfesorYMateria', ProfesorYMateriaController_1.profesorYMateriaController.update);
    }
}
const profesorYMateriaRoutes = new ProfesorYMateriaRoutes();
exports.default = profesorYMateriaRoutes.router;
