"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ExternosCodirectorController_1 = require("../controllers/ExternosCodirectorController");
class ExternosCodirectorRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/create', ExternosCodirectorController_1.externosCodirectorController.create);
        this.router.get('/', ExternosCodirectorController_1.externosCodirectorController.list);
        this.router.get('/:idExternoCodirector', ExternosCodirectorController_1.externosCodirectorController.listOne);
        this.router.put('/update/:idExternoCodirector', ExternosCodirectorController_1.externosCodirectorController.actualizar);
        this.router.delete('/delete/:idExternoCodirector', ExternosCodirectorController_1.externosCodirectorController.delete);
    }
}
const externosCodirectorRoutes = new ExternosCodirectorRoutes();
exports.default = externosCodirectorRoutes.router;
