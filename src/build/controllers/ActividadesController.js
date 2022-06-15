"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actividadesController = void 0;
const database_1 = __importDefault(require("../database"));
class ActividadesController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT * FROM actividades order by idActividad');
            res.json(respuesta);
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respuesta = yield database_1.default.query('SELECT * FROM actividades WHERE idActividad = ?', [id]);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'mensaje': 'Actividad no encontrado' });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield database_1.default.query('INSERT INTO actividades SET ?', [req.body]);
            res.json(resp);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idActividad } = req.params;
            const resp = yield database_1.default.query(`DELETE FROM actividades WHERE idActividad=${idActividad}`);
            res.json(resp);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idActividad } = req.params;
            const resp = yield database_1.default.query('UPDATE actividades set ? WHERE idActividad=?', [req.body, idActividad]);
            res.json(resp);
        });
    }
    getActividadesByProfesor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, fechaIni, fechaFin } = req.params;
            let respuesta = yield database_1.default.query(`SELECT A.*, P.nombreProfesor FROM actividades as A INNER JOIN profesores P ON P.idProfesor=A.idProfesor WHERE A.idProfesor=${idProfesor} AND inicio>='${fechaIni}' AND inicio<='${fechaFin}'`);
            res.json(respuesta);
        });
    }
    getActividadesByInstituto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idInstituto, fechaIni, fechaFin } = req.params;
            let respuesta = yield database_1.default.query(`SELECT A.*, P.nombreProfesor FROM actividades as A INNER JOIN profesores P ON P.idProfesor=A.idProfesor WHERE P.idInstituto=${idInstituto} AND A.inicio>='${fechaIni}' AND A.inicio<='${fechaFin}'`);
            res.json(respuesta);
        });
    }
    getActividadesByCarrera(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idCarrera, fechaIni, fechaFin } = req.params;
            let respuesta = yield database_1.default.query(`SELECT A.*, P.nombreProfesor FROM actividades as A INNER JOIN profesores P ON P.idProfesor=A.idProfesor WHERE P.idCarrera=${idCarrera} AND A.inicio>='${fechaIni}' AND A.inicio<='${fechaFin}'`);
            res.json(respuesta);
        });
    }
    listActividadesByProfesorByPeriodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, fechaIni, fechaFin } = req.params;
            let respuesta = yield database_1.default.query(`SELECT * FROM actividades  WHERE idProfesor=${idProfesor} AND inicio>='${fechaIni}' AND fin<='${fechaFin}'`);
            res.json(respuesta);
        });
    }
}
exports.actividadesController = new ActividadesController();
