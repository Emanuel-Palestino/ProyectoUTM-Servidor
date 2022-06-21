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
exports.profesorYPatenteController = void 0;
const database_1 = __importDefault(require("../database"));
class ProfesorYPatenteController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT * FROM profesorYpatente order by idPatente');
            res.json(respuesta);
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, idPatente, esInterno } = req.params;
            const respuesta = yield database_1.default.query(`SELECT * FROM profesorYpatente WHERE idProfesor=${idProfesor} AND idPatente =${idPatente} AND esInterno=${esInterno}`);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'mensaje': 'Patente no encontrada' });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield database_1.default.query("INSERT INTO profesorYpatente set ?", [req.body]);
            res.json(resp);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, idPatente, esInterno } = req.params;
            const resp = yield database_1.default.query(`DELETE FROM profesorYpatente WHERE idProfesor=${idProfesor} AND idPatente =${idPatente} AND esInterno=${esInterno}`);
            res.json(resp);
        });
    }
    actualizar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, idPatente, esInterno } = req.params;
            const resp = yield database_1.default.query(`UPDATE profesorYpatente set ? WHERE idProfesor=${idProfesor} AND idPatente =${idPatente} AND esInterno=${esInterno}`, req.body);
            res.json(resp);
        });
    }
}
exports.profesorYPatenteController = new ProfesorYPatenteController();
