"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PeriodoController_1 = require("../controllers/PeriodoController");
class PeriodoRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', PeriodoController_1.periodoController.list);
        this.router.get('/:id', PeriodoController_1.periodoController.listOne);
        this.router.post('/create', PeriodoController_1.periodoController.create);
        this.router.delete('/delete/:idPeriodo', PeriodoController_1.periodoController.delete);
        this.router.put('/update/:idPeriodo', PeriodoController_1.periodoController.update);
    }
}
const periodoRoutes = new PeriodoRoutes();
exports.default = periodoRoutes.router;
