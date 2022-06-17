"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EventosController_1 = require("../controllers/EventosController");
class EventosRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/listEventosByPeriodo/:idProfesor/:fechaIni/:fechaFin', EventosController_1.eventosController.listEventosByPeriodo);
        this.router.get('/', EventosController_1.eventosController.list);
        this.router.get('/:id', EventosController_1.eventosController.listOne);
        this.router.post('/create', EventosController_1.eventosController.create);
        this.router.delete('/delete/:idEvento', EventosController_1.eventosController.delete);
        this.router.put('/update/:idEvento', EventosController_1.eventosController.update);
        this.router.get('/eventosByProfesor/:idProfesor/:fechaIni/:fechaFin', EventosController_1.eventosController.getEventosByProfesor);
        this.router.get('/eventosByInstituto/:idInstituto/:fechaIni/:fechaFin', EventosController_1.eventosController.getEventosByInstituto);
        this.router.get('/eventosByCarrera/:idCarrera/:fechaIni/:fechaFin', EventosController_1.eventosController.getEventosByCarrera);
    }
}
const eventosRoutes = new EventosRoutes();
exports.default = eventosRoutes.router;
