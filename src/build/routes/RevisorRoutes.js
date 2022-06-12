"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RevisorController_1 = require("../controllers/RevisorController");
class RevisorRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', RevisorController_1.revisorController.list);
        this.router.get('/:idRevisor', RevisorController_1.revisorController.listOne);
        this.router.post('/create', RevisorController_1.revisorController.create);
        this.router.delete('/delete/:idRevisor', RevisorController_1.revisorController.delete);
        this.router.put('/update/:idRevisor', RevisorController_1.revisorController.update);
    }
}
const revisorRoutes = new RevisorRoutes();
exports.default = revisorRoutes.router;