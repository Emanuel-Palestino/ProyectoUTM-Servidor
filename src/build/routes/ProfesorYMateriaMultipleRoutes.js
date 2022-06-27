"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProfesorYMateriaMultipleController_1 = require("../controllers/ProfesorYMateriaMultipleController");
class ProfesorYMateriaMultipleRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', ProfesorYMateriaMultipleController_1.profesorYMateriaMultipleController.list);
        this.router.get('/:idProfesorYMateriaMultiple', ProfesorYMateriaMultipleController_1.profesorYMateriaMultipleController.listOne);
        this.router.post('/create', ProfesorYMateriaMultipleController_1.profesorYMateriaMultipleController.create);
        this.router.delete('/delete/:idProfesorYMateriaMultiple', ProfesorYMateriaMultipleController_1.profesorYMateriaMultipleController.delete);
        this.router.put('/update/:idProfesorYMateriaMultiple', ProfesorYMateriaMultipleController_1.profesorYMateriaMultipleController.update);
    }
}
const profesorYMateriaMultipleRoutes = new ProfesorYMateriaMultipleRoutes();
exports.default = profesorYMateriaMultipleRoutes.router;
