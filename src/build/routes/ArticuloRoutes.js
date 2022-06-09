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
        this.router.get('/:id', ArticulosController_1.articulosController.listOne);
        this.router.post('/create', ArticulosController_1.articulosController.create);
        this.router.delete('/delete/:idArticulo', ArticulosController_1.articulosController.delete);
        this.router.put('/update/:idArticulo', ArticulosController_1.articulosController.update);
    }
}
const articulosRoutes = new ArticulosRoutes();
exports.default = articulosRoutes.router;
