"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProfesorMateriaController_1 = require("../controllers/ProfesorMateriaController");
class ProfesorMateriaRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', ProfesorMateriaController_1.profesorMateriaController.list);
        this.router.get('/:id', ProfesorMateriaController_1.profesorMateriaController.listOne);
        this.router.post('/create', ProfesorMateriaController_1.profesorMateriaController.create);
        this.router.delete('/delete/:idMateria', ProfesorMateriaController_1.profesorMateriaController.delete);
        this.router.put('/update/:idMateria', ProfesorMateriaController_1.profesorMateriaController.update);
    }
}
const profesorMateriaRoutes = new ProfesorMateriaRoutes();
exports.default = profesorMateriaRoutes.router;
