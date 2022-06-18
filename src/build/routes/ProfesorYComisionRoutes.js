"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProfesorYComisionController_1 = require("../controllers/ProfesorYComisionController");
class ProfesorYComisionRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', ProfesorYComisionController_1.profesorYComisionController.list);
        this.router.post('/addComisionado/:idComision', ProfesorYComisionController_1.profesorYComisionController.addComisionado);
        this.router.get('/:idProfesor/:idComision', ProfesorYComisionController_1.profesorYComisionController.listOne);
        this.router.post('/create', ProfesorYComisionController_1.profesorYComisionController.create);
        this.router.delete('/delete/:idProfesor/:idComision', ProfesorYComisionController_1.profesorYComisionController.delete);
        this.router.put('/update/:idProfesor/:idComision', ProfesorYComisionController_1.profesorYComisionController.update);
    }
}
const profesorYComisionRoutes = new ProfesorYComisionRoutes();
exports.default = profesorYComisionRoutes.router;
