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
exports.profesorYProyectoController = void 0;
const database_1 = __importDefault(require("../database"));
class ProfesorYProyectoController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT * FROM profesorYproyecto ');
            res.json(respuesta);
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProyecto, idProfesor } = req.params;
            const respuesta = yield database_1.default.query('SELECT * FROM profesorYproyecto WHERE idProyecto = ? AND idProfesor = ?', [idProyecto, idProfesor]);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'mensaje': 'Profesor y proyecto no encontrado' });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield database_1.default.query('INSERT INTO profesorYproyecto SET ?', [req.body]);
            res.json(resp);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProyecto, idProfesor } = req.params;
            const resp = yield database_1.default.query(`DELETE FROM profesorYproyecto WHERE idProyecto=${idProyecto} AND idProfesor=${idProfesor}`);
            res.json(resp);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProyecto, idProfesor } = req.params;
            const resp = yield database_1.default.query('UPDATE profesorYproyecto set ? WHERE idProyecto=? AND idProfesor = ?', [req.body, idProyecto, idProfesor]);
            res.json(resp);
        });
    }
}
exports.profesorYProyectoController = new ProfesorYProyectoController();
