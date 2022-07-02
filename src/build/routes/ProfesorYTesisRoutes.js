"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProfesorYTesisController_1 = require("../controllers/ProfesorYTesisController");
class TesistasRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', ProfesorYTesisController_1.profesorYTesisController.list);
        this.router.get('/:idTesis/:idProfesor', ProfesorYTesisController_1.profesorYTesisController.listOne);
        this.router.post('/create', ProfesorYTesisController_1.profesorYTesisController.create);
        this.router.post('/createCodirectorExternoTesista/:idTesis', ProfesorYTesisController_1.profesorYTesisController.createCodirectorExternoTesista);
        this.router.delete('/delete/:idTesis/:idProfesor', ProfesorYTesisController_1.profesorYTesisController.delete);
        this.router.put('/update/:idTesis/:idProfesor', ProfesorYTesisController_1.profesorYTesisController.update);
    }
}
const tesistasRoutes = new TesistasRoutes();
exports.default = tesistasRoutes.router;
