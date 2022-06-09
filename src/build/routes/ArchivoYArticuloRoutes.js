"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ArchivoYArticuloController_1 = require("../controllers/ArchivoYArticuloController");
class ArchivoYArticuloRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/:idArticulo', ArchivoYArticuloController_1.archivoYArticuloController.archivosPorArticulo);
    }
}
const archivoYArticuloRoutes = new ArchivoYArticuloRoutes();
exports.default = archivoYArticuloRoutes.router;
