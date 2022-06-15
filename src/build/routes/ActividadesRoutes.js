"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ActividadesController_1 = require("../controllers/ActividadesController");
class ActividadesRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', ActividadesController_1.actividadesController.list);
        this.router.get('/:id', ActividadesController_1.actividadesController.listOne);
        this.router.post('/create', ActividadesController_1.actividadesController.create);
        this.router.delete('/delete/:idActividad', ActividadesController_1.actividadesController.delete);
        this.router.put('/update/:idActividad', ActividadesController_1.actividadesController.update);
        this.router.get('/actividadesByProfesor/:idProfesor/:fechaIni/:fechaFin', ActividadesController_1.actividadesController.getActividadesByProfesor);
        this.router.get('/actividadesByInstituto/:idInstituto/:fechaIni/:fechaFin', ActividadesController_1.actividadesController.getActividadesByInstituto);
        this.router.get('/actividadesByCarrera/:idCarrera/:fechaIni/:fechaFin', ActividadesController_1.actividadesController.getActividadesByCarrera);
        this.router.get('/listActividadesByProfesorByPeriodo/:idProfesor/:fechaIni/:fechaFin', ActividadesController_1.actividadesController.listActividadesByProfesorByPeriodo);
    }
}
const actividadesRoutes = new ActividadesRoutes();
exports.default = actividadesRoutes.router;
