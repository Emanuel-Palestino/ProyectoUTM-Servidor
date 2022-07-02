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
exports.eventosController = void 0;
const database_1 = __importDefault(require("../database"));
class EventosController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT * FROM eventos order by idEvento');
            res.json(respuesta);
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respuesta = yield database_1.default.query('SELECT * FROM eventos WHERE idEvento = ?', [id]);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'mensaje': 'Evento no encontrado' });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield database_1.default.query('INSERT INTO eventos SET ?', [req.body]);
            res.json(resp);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idEvento } = req.params;
            const resp = yield database_1.default.query(`DELETE FROM eventos WHERE idEvento=${idEvento}`);
            res.json(resp);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idEvento } = req.params;
            const resp = yield database_1.default.query('UPDATE eventos set ? WHERE idEvento=?', [req.body, idEvento]);
            res.json(resp);
        });
    }
    getEventosByProfesor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, fechaIni, fechaFin } = req.params;
            let respuesta = yield database_1.default.query(`SELECT E.*, P.nombreProfesor, P.idProfesor FROM eventos as E INNER JOIN profesores P ON P.idProfesor=E.idProfesor WHERE P.idProfesor=${idProfesor} AND inicio>='${fechaIni}' AND fin<='${fechaFin}'`);
            res.json(respuesta);
        });
    }
    getEventosByInstituto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idInstituto, fechaIni, fechaFin } = req.params;
            let respuesta = yield database_1.default.query(`SELECT E.*, P.nombreProfesor FROM eventos as E INNER JOIN profesores P ON P.idProfesor=E.idProfesor WHERE P.idInstituto=${idInstituto} AND E.inicio>='${fechaIni}' AND E.fin<='${fechaFin}'`);
            res.json(respuesta);
        });
    }
    getEventosByCarrera(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idCarrera, fechaIni, fechaFin } = req.params;
            let respuesta = yield database_1.default.query(`SELECT E.*, P.nombreProfesor FROM eventos as E INNER JOIN profesores P ON P.idProfesor=E.idProfesor WHERE P.idCarrera=${idCarrera} AND E.inicio>='${fechaIni}' AND E.fin<='${fechaFin}'`);
            res.json(respuesta);
        });
    }
    listEventosByPeriodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, fechaIni, fechaFin } = req.params;
            let respuesta = yield database_1.default.query(`SELECT idEvento, nombreEvento,titulo, tipoEvento, participacion, afectaLinea, tipoParticipacion, inicio, fin, comprobante FROM eventos WHERE idProfesor='${idProfesor}' AND inicio>='${fechaIni}' and fin<='${fechaFin}'`);
            res.json(respuesta);
        });
    }
}
exports.eventosController = new EventosController();
