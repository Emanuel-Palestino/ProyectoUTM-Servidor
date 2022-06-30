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
exports.profesorYMateriaController = void 0;
const database_1 = __importDefault(require("../database"));
class ProfesorYMateriaController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT * FROM profesorYmateria ORDER BY idProfesorYMateria');
            res.json(respuesta);
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesorYMateria } = req.params;
            const respuesta = yield database_1.default.query('SELECT * FROM profesorYmateria WHERE idProfesorYMateria = ?', [idProfesorYMateria]);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'mensaje': 'profesorYmateria no encontrado' });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let resp = yield database_1.default.query('SELECT idPeriodo FROM periodo WHERE actual=1');
            req.body.idPeriodo = resp[0].idPeriodo;
            resp = yield database_1.default.query('INSERT INTO profesorYmateria SET ?', [req.body]);
            res.json(resp);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesorYMateria } = req.params;
            const resp = yield database_1.default.query(`DELETE FROM profesorYmateria WHERE idProfesorYMateria=${idProfesorYMateria}`);
            res.json(resp);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesorYMateria } = req.params;
            const resp = yield database_1.default.query('UPDATE profesorYmateria set ? WHERE idProfesorYMateria=?', [req.body, idProfesorYMateria]);
            res.json(resp);
        });
    }
}
exports.profesorYMateriaController = new ProfesorYMateriaController();
