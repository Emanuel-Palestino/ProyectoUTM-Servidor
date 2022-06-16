"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ArticulosController_1 = require("../controllers/ArticulosController");
class ArticulosRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', ArticulosController_1.articulosController.list);
        this.router.get('/todoDividido', ArticulosController_1.articulosController.getTodoDivididoInstituto);
        this.router.get('/:id', ArticulosController_1.articulosController.listOne);
        this.router.post('/create/:idProfesor', ArticulosController_1.articulosController.create);
        this.router.delete('/delete/:idArticulo', ArticulosController_1.articulosController.delete);
        this.router.put('/update/:idArticulo', ArticulosController_1.articulosController.update);
        this.router.get('/articulosByInstituto/:idInstituto', ArticulosController_1.articulosController.getArticulosByInstituto);
        this.router.get('/getSugerenciasExternoByAutorUTM/:idProfesor', ArticulosController_1.articulosController.getSugerenciasExternoByAutorUTM);
        this.router.get('/:fechaIni/:fechaFin', ArticulosController_1.articulosController.listByPeriodo);
        this.router.get('/articulosByInstituto/:idInstituto/:fechaIni/:fechaFin', ArticulosController_1.articulosController.getArticulosByInstitutoByFecha);
        this.router.get('/articulosByProfesor/:idProfesor/:fechaIni/:fechaFin', ArticulosController_1.articulosController.getArticulosByProfesor);
        this.router.get('/todoByInstituto/:idInstituto/:fechaIni/:fechaFin', ArticulosController_1.articulosController.getTodoPorInsituto);
        this.router.get('/todoDividido/:fechaIni/:fechaFin', ArticulosController_1.articulosController.getTodoDivididoInstitutoPorFecha);
    }
}
const articulosRoutes = new ArticulosRoutes();
exports.default = articulosRoutes.router;
