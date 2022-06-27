"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PatentesController_1 = require("../controllers/PatentesController");
class PatentesRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/create/:idProfesor', PatentesController_1.patentesController.create);
        this.router.get('/', PatentesController_1.patentesController.list);
        this.router.get('/:id', PatentesController_1.patentesController.listOne);
        this.router.delete('/delete/:id', PatentesController_1.patentesController.delete);
        this.router.put('/actualizar/:id', PatentesController_1.patentesController.actualizar);
        this.router.get('/listPatentesByProfesorByPeriodo/:idProfesor/:fechaIni/:fechaFin', PatentesController_1.patentesController.listPatentesByProfesorByPeriodo);
        this.router.get('/listColaboradoresInternosPatentes/:idProfesor', PatentesController_1.patentesController.listColaboradoresInternosPatentes);
        this.router.get('/listSugerenciasColaboradoresExternosPatente/:idProfesor', PatentesController_1.patentesController.colaboradoresExternos);
        this.router.get('/listColaboradoresExternosExistentesSinColaboracionPatentes/:idProfesor', PatentesController_1.patentesController.listColaboradoresExternosExistentesSinColaboracionPatentes);
        this.router.put('/updatePrioridadesOfColaboradoresByPatente/:idPatente', PatentesController_1.patentesController.updatePrioridadesOfColaboradoresByPatente);
        this.router.get('/listPatentesByCarreraByPeriodo/:idCarrera/:fechaIni/:fechaFin', PatentesController_1.patentesController.listPatentesByCarreraByPeriodo);
        this.router.post('/addColaboradoresPatenteUTM/:idPatente', PatentesController_1.patentesController.addColaboradoresPatenteUTM);
        this.router.post('/createColaboradorExternoPatente/:idPatente', PatentesController_1.patentesController.createColaboradorExternoPatente);
        this.router.get('/listProfesoresByInstitutoSinColaboradoresInternosByPatente/:idInstituto/:idPatente', PatentesController_1.patentesController.listProfesoresByInstitutoSinColaboradoresInternosByPatente);
    }
}
const patentesRoutes = new PatentesRoutes();
exports.default = patentesRoutes.router;
