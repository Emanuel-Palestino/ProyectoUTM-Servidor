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
exports.proyectosController = void 0;
const database_1 = __importDefault(require("../database"));
class ProyectosController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT * FROM proyectos');
            res.json(respuesta);
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProyecto } = req.params;
            const respuesta = yield database_1.default.query('SELECT * FROM proyectos WHERE idProyecto = ?', [idProyecto]);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'mensaje': 'Proyecto no encontrado' });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield database_1.default.query('INSERT INTO proyectos SET ?', [req.body]);
            res.json(resp);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProyecto } = req.params;
            const resp = yield database_1.default.query(`DELETE FROM proyectos WHERE idProyecto=${idProyecto}`);
            res.json(resp);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProyecto } = req.params;
            const resp = yield database_1.default.query('UPDATE proyectos set ? WHERE idProyecto=?', [req.body, idProyecto]);
            res.json(resp);
        });
    }
    listColaboradoresExternosProyectos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor } = req.params;
            let consulta = `SELECT ep.idExternoProyecto as idExterno, ep.nombreExterno FROM profesoryproyecto as pyp INNER JOIN externosproyecto as ep ON pyp.idProfesor = ep.idExternoProyecto WHERE idProyecto = ANY (SELECT idProyecto from profesoryproyecto WHERE idProfesor = ${idProfesor} AND esInterno = 1) AND esInterno = 0;`;
            const resp = yield database_1.default.query(consulta);
            res.json(resp);
        });
    }
}
exports.proyectosController = new ProyectosController();
