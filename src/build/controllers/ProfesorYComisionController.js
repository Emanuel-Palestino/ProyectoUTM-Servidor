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
exports.profesorYComisionController = void 0;
const database_1 = __importDefault(require("../database"));
class ProfesorYComisionController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT * FROM profesorYcomision order by pos');
            res.json(respuesta);
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, idComision } = req.params;
            const respuesta = yield database_1.default.query('SELECT * FROM profesorYcomision WHERE idProfesor = ? AND idComision = ?', [idProfesor, idComision]);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'mensaje': 'Fila no encontrada' });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield database_1.default.query('INSERT INTO profesorYcomision SET ?', [req.body]);
            res.json(resp);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, idComision } = req.params;
            const resp = yield database_1.default.query(`DELETE FROM profesorYcomision WHERE idProfesor = ${idProfesor} AND idComision = ${idComision}`);
            res.json(resp);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, idComision } = req.params;
            const resp = yield database_1.default.query('UPDATE profesorYcomision set ? WHERE idProfesor = ? AND idComision = ?', [req.body, idProfesor, idComision]);
            res.json(resp);
        });
    }
    addComisionado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { idComision } = req.params;
            let respT = [];
            for (let i = 0; i < req.body.length; i++) {
                let dato = {
                    idComision: idComision,
                    idProfesor: req.body[i].idProfesor,
                    pos: req.body[i].pos,
                    final: req.body[i].final,
                    comprobante: ' '
                };
                const resp = yield database_1.default.query('INSERT INTO profesorYcomision SET ?', dato);
                respT.push(resp);
            }
            res.json(respT);
        });
    }
}
exports.profesorYComisionController = new ProfesorYComisionController();
