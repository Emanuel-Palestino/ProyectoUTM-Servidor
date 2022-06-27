"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProfesoresController_1 = require("../controllers/ProfesoresController");
class ProfesoresRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', ProfesoresController_1.profesoresController.list);
        this.router.get('/listProfesorByInstituto', ProfesoresController_1.profesoresController.listProfesorByInstituto);
        this.router.get('/:id', ProfesoresController_1.profesoresController.listOne);
        this.router.post('/create', ProfesoresController_1.profesoresController.create);
        this.router.delete('/delete/:idProfesor', ProfesoresController_1.profesoresController.delete);
        this.router.put('/cambiarContrasena/:correo', ProfesoresController_1.profesoresController.cambiarContraseña);
        this.router.put('/update/:idProfesor', ProfesoresController_1.profesoresController.update);
        this.router.get('/profesoresByInstituto/:idInstituto', ProfesoresController_1.profesoresController.getProfesorByInstituto);
        this.router.get('/profesoresByCarrera/:idCarrera', ProfesoresController_1.profesoresController.getProfesorByCarrera);
        this.router.get('/profesoresByArticulo/:idArticulo', ProfesoresController_1.profesoresController.getProfesoresByArticulo);
        this.router.post('/autenticar', ProfesoresController_1.profesoresController.existe);
        this.router.put('/updateDatosPersonales/:idProfesor', ProfesoresController_1.profesoresController.updateDatosPersonales);
    }
}
const profesoresRoutes = new ProfesoresRoutes();
exports.default = profesoresRoutes.router;
