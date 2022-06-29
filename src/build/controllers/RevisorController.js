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
exports.revisorController = void 0;
const database_1 = __importDefault(require("../database"));
class RevisorController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT * FROM revisor order by idRevisor');
            res.json(respuesta);
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idRevisor } = req.params;
            const respuesta = yield database_1.default.query('SELECT * FROM revisor WHERE idRevisor = ?', [idRevisor]);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'mensaje': 'Revisor no encontrado' });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield database_1.default.query('INSERT INTO revisor SET ?', [req.body]);
            res.json(resp);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idRevisor } = req.params;
            const resp = yield database_1.default.query(`DELETE FROM revisor WHERE idRevisor=${idRevisor}`);
            res.json(resp);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idRevisor } = req.params;
            const resp = yield database_1.default.query('UPDATE revisor set ? WHERE idRevisor=?', [req.body, idRevisor]);
            res.json(resp);
        });
    }
    listRevisionByProfesor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, fechaIni, fechaFin } = req.params;
            const resp = yield database_1.default.query(`SELECT tipoRP,nombreRI,fecha,tituloRP,idRevisor FROM revisor WHERE idProfesor = ${idProfesor} AND fecha>= '${fechaIni}' AND fecha<='${fechaFin}'`);
            res.json(resp);
        });
    }
    listRevisionByCarreraByPeriodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idCarrera, fechaIni, fechaFin } = req.params;
            const resp = yield database_1.default.query(`SELECT S.tipoRP, S.nombreRI, S.fecha, S.tituloRP, S.idRevisor, S.idProfesor, P.nombreProfesor FROM profesores as P INNER JOIN revisor S ON S.idProfesor = P.idProfesor WHERE P.idCarrera = ${idCarrera} AND fecha>= '${fechaIni}' AND fecha<='${fechaFin}'`);
            res.json(resp);
        });
    }
}
exports.revisorController = new RevisorController();
