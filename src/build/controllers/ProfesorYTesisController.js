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
exports.profesorYTesisController = void 0;
const database_1 = __importDefault(require("../database"));
class ProfesorYTesisController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT * FROM profesorYtesis order by idTesis');
            res.json(respuesta);
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idTesis, idProfesor } = req.params;
            const respuesta = yield database_1.default.query(`SELECT * FROM profesorYtesis WHERE idTesis =${idTesis} AND idProfesor=${idProfesor}`);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'mensaje': 'profesorYTesis no encontrado' });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield database_1.default.query("INSERT INTO profesorYtesis set ?", [req.body]);
            res.json(resp);
        });
    }
    createCodirectorExternoTesista(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idTesis } = req.params;
            let datoE = {
                nombreCodirector: req.body.nombreCodirector,
                correo: req.body.correo
            };
            const resp = yield database_1.default.query('INSERT INTO externosCodirector SET ?', [datoE]);
            let dato = {
                idProfesor: resp.insertId,
                idTesis: idTesis,
                pos: req.body.pos,
                esInterno: 0
            };
            const resp2 = yield database_1.default.query('INSERT INTO profesorYtesis SET ?', dato);
            res.json(resp2);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idTesis, idProfesor } = req.params;
            const resp = yield database_1.default.query(`DELETE FROM profesorYtesis WHERE idTesis = ${idTesis} AND idProfesor = ${idProfesor}`);
            res.json(resp);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idTesis, idProfesor } = req.params;
            const resp = yield database_1.default.query(`UPDATE profesorYtesis set ? WHERE idTesis = ${idTesis} AND idProfesor = ${idProfesor}`, [req.body, idTesis, idProfesor]);
            res.json(resp);
        });
    }
}
exports.profesorYTesisController = new ProfesorYTesisController();
