"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TesistasController_1 = require("../controllers/TesistasController");
class TesistasRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', TesistasController_1.tesistasController.list);
        this.router.get('/:id', TesistasController_1.tesistasController.listOne);
        this.router.post('/create', TesistasController_1.tesistasController.create);
        this.router.delete('/delete/:id', TesistasController_1.tesistasController.delete);
        this.router.put('/update/:id', TesistasController_1.tesistasController.update);
    }
}
const tesistasRoutes = new TesistasRoutes();
exports.default = tesistasRoutes.router;
