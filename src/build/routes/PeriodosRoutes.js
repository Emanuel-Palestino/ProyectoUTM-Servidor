"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PeriodoController_1 = require("../controllers/PeriodoController");
class PeriodosRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/create', PeriodoController_1.periodoController.create);
        this.router.get('/', PeriodoController_1.periodoController.list);
        this.router.get('/:id', PeriodoController_1.periodoController.listOne);
        this.router.put('/update/:idPeriodo', PeriodoController_1.periodoController.update);
        this.router.delete('/delete/:idPeriodo', PeriodoController_1.periodoController.delete);
    }
}
const periodosRoutes = new PeriodosRoutes();
exports.default = periodosRoutes.router;
