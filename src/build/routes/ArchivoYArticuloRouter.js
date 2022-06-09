"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ArticuloYProfesorController_1 = require("../controllers/ArticuloYProfesorController");
class ArchivoYArticuloRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/:idArticulo', ArticuloYProfesorController_1.articuloYProfesorController.listOne);
    }
}
const articuloYProfesorRoutes = new ArchivoYArticuloRoutes();
exports.default = articuloYProfesorRoutes.router;
