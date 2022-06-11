"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProfesorYPatenteController_1 = require("../controllers/ProfesorYPatenteController");
class ProfesorYPatenteRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', ProfesorYPatenteController_1.profesorYPatenteController.list);
        this.router.get('/listOne/:idProfesor/:idPatente/:esInterno', ProfesorYPatenteController_1.profesorYPatenteController.listOne);
        this.router.post('/create', ProfesorYPatenteController_1.profesorYPatenteController.create);
        this.router.delete('/delete/:idProfesor/:idPatente/:esInterno', ProfesorYPatenteController_1.profesorYPatenteController.delete);
        this.router.put('/actualizar/:idProfesor/:idPatente/:esInterno', ProfesorYPatenteController_1.profesorYPatenteController.actualizar);
    }
}
const profesorYPatentesRoutes = new ProfesorYPatenteRoutes();
exports.default = profesorYPatentesRoutes.router;
