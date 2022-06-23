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
        this.router.get('/listAutoresExternosExistentesSinColaboracionArticulos/:idProfesor', ArticulosController_1.articulosController.listAutoresExternosExistentesSinColaboracionArticulos);
        this.router.post('/create/:idProfesor/:fecha', ArticulosController_1.articulosController.create);
        this.router.delete('/delete/:idArticulo', ArticulosController_1.articulosController.delete);
        this.router.put('/update/:idArticulo', ArticulosController_1.articulosController.update);
        this.router.get('/articulosByInstituto/:idInstituto', ArticulosController_1.articulosController.getArticulosByInstituto);
        this.router.get('/getSugerenciasExternoByAutorUTM/:idProfesor', ArticulosController_1.articulosController.getSugerenciasExternoByAutorUTM);
        this.router.post('/addAutorExterno/:idArticulo/:fecha', ArticulosController_1.articulosController.addAutorExterno);
        this.router.get('/:fechaIni/:fechaFin', ArticulosController_1.articulosController.listByPeriodo);
        this.router.get('/articulosByInstituto/:idInstituto/:fechaIni/:fechaFin', ArticulosController_1.articulosController.getArticulosByInstitutoByFecha);
        this.router.get('/listArticulosByProfesorByPeriodo/:idProfesor/:fechaIni/:fechaFin', ArticulosController_1.articulosController.listArticulosByProfesorByPeriodo);
        this.router.get('/todoByInstituto/:idInstituto/:fechaIni/:fechaFin', ArticulosController_1.articulosController.getTodoPorInsituto);
        this.router.get('/todoDividido/:fechaIni/:fechaFin', ArticulosController_1.articulosController.getTodoDivididoInstitutoPorFecha);
        this.router.get('/listArticulosByProfesorByPeriodoByTitulo/:idProfesor/:fechaIni/:fechaFin', ArticulosController_1.articulosController.listArticulosByProfesorByPeriodoByTitulo);
    }
}
const articulosRoutes = new ArticulosRoutes();
exports.default = articulosRoutes.router;
