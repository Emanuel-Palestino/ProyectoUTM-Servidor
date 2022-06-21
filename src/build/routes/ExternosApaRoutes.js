"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ExternosApaController_1 = require("../controllers/ExternosApaController");
class ExternosApaRouters {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', ExternosApaController_1.externosApaController.list);
        this.router.get('/:idExternoAPA', ExternosApaController_1.externosApaController.listOne);
        this.router.post('/create', ExternosApaController_1.externosApaController.create);
        this.router.delete('/delete/:idExternoAPA', ExternosApaController_1.externosApaController.delete);
        this.router.put('/update/:idExternoAPA', ExternosApaController_1.externosApaController.update);
    }
}
const externosApaRouters = new ExternosApaRouters();
exports.default = externosApaRouters.router;
