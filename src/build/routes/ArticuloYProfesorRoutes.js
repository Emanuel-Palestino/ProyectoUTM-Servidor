"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProfesorYArticuloController_1 = require("../controllers/ProfesorYArticuloController");
class ArticuloYProfesorRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', ProfesorYArticuloController_1.profesorYArticuloController.list);
        this.router.get('/:id', ProfesorYArticuloController_1.profesorYArticuloController.listOne);
        this.router.post('/create', ProfesorYArticuloController_1.profesorYArticuloController.create);
        this.router.delete('/delete/:idArticuloYProfesor', ProfesorYArticuloController_1.profesorYArticuloController.delete);
        this.router.put('/update/:idArticuloYProfesor', ProfesorYArticuloController_1.profesorYArticuloController.update);
        this.router.get('/profesoresByArticulo/:idArticulo', ProfesorYArticuloController_1.profesorYArticuloController.profesoresByArticulo);
        this.router.get('/articulosByCarrera/:idCarrera', ProfesorYArticuloController_1.profesorYArticuloController.articulosByCarrera);
    }
}
const articuloYProfesorRoutes = new ArticuloYProfesorRoutes();
exports.default = articuloYProfesorRoutes.router;
