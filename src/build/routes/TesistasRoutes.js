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
        this.router.post('/create/:idProfesor', TesistasController_1.tesistasController.create);
        this.router.delete('/delete/:id', TesistasController_1.tesistasController.delete);
        this.router.put('/update/:id', TesistasController_1.tesistasController.update);
        this.router.get('/listCodirectoresExternosSugerencias/:idProfesor', TesistasController_1.tesistasController.listCodirectoresExternosSugerencias);
        this.router.get('/listCodirectoresExternos/:idProfesor', TesistasController_1.tesistasController.listCodirectoresExternos);
        this.router.get('/listTesistasByProfesorByPeriodo/:idProfesor/:fechaIni/:fechaFin', TesistasController_1.tesistasController.listTesistasByProfesorByPeriodo);
        this.router.get('/listTesistasByCarreraByPeriodo/:idCarrera/:fechaIni/:fechaFin', TesistasController_1.tesistasController.listTesistasByCarreraByPeriodo);
        this.router.get('/listTesistasByProfesorByPeriodoByInicio/:idProfesor/:fechaIni/:fechaFin', TesistasController_1.tesistasController.listTesistasByProfesorByPeriodoByInicio);
        this.router.get('/listTesistasByProfesorByPeriodoByStatus/:idProfesor/:fechaIni/:fechaFin', TesistasController_1.tesistasController.listTesistasByProfesorByPeriodoByStatus);
        this.router.get('/listTesistasByProfesorByPeriodoByNombreTesis/:idProfesor/:fechaIni/:fechaFin', TesistasController_1.tesistasController.listTesistasByProfesorByPeriodoByNombreTesis);
        this.router.put('/updatePrioridadesTestistas/:idTesis', TesistasController_1.tesistasController.updatePrioridadesTestistas);
        this.router.get('/listNoColaboradoresUTMByCarreraByTesis/:idCarrera/:idTesis', TesistasController_1.tesistasController.listNoColaboradoresUTMByCarreraByTesis);
        this.router.post('/addCodirectoresTesistaUTM/:idTesis', TesistasController_1.tesistasController.addCodirectoresTesistaUTM);
        this.router.get('/listProfesoresbyInstitutoNoCodirectores/:idInstituto/:idTesis', TesistasController_1.tesistasController.listProfesoresbyInstitutoNoCodirectores);
    }
}
const tesistasRoutes = new TesistasRoutes();
exports.default = tesistasRoutes.router;
