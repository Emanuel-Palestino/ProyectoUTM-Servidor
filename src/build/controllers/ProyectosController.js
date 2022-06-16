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
    listProyectosByProfesorByPeriodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, fechaIni, fechaFin } = req.params;
            let respuesta = yield database_1.default.query(`SELECT P.* FROM proyectos as P INNER JOIN profesorYProyecto PP ON PP.idProyecto = P.idProyecto WHERE PP.idProfesor=${idProfesor} AND inicio >= '${fechaIni}' AND fin <= '${fechaFin}'`);
            //Obtenemos los profesores participantes
            for (let i = 0; i < respuesta.length; i++) {
                //Con esta consulta obtenemos los colaboradores del proyecto 
                const respuestaColaboradores = yield database_1.default.query('SELECT P.* FROM profesores as P INNER JOIN profesorYProyecto PP ON PP.idProfesor = P.idProfesor WHERE PP.idProyecto = ? ORDER BY PP.pos', respuesta[i].idProyecto);
                respuesta[i].colaboradores = respuestaColaboradores;
            }
            res.json(respuesta);
        });
    }
}
exports.proyectosController = new ProyectosController();
