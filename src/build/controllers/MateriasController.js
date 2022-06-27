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
exports.materiasController = void 0;
const database_1 = __importDefault(require("../database"));
class MateriasController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield database_1.default.query('INSERT INTO materias SET ?', [req.body]);
            res.json(resp);
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT * FROM materias');
            res.json(respuesta);
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idMateria } = req.params;
            const respuesta = yield database_1.default.query('SELECT * FROM materias WHERE idMateria = ?', [idMateria]);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'mensaje': 'materias no encontrada' });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idMateria } = req.params;
            const resp = yield database_1.default.query('UPDATE materias set ? WHERE idMateria=?', [req.body, idMateria]);
            res.json(resp);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idMateria } = req.params;
            const resp = yield database_1.default.query(`DELETE FROM materias WHERE idMateria=${idMateria}`);
            res.json(resp);
        });
    }
    listMateriasByAnyoByPeriodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, anyoIni, anyoFin } = req.params;
            let consulta = `SELECT pym.idMateria, pym.grupo, c.nombreCarrera, pl.nombrePlan as plan, p.nombre as nombrePeriodo, p.actual FROM profesorYmateria pym INNER JOIN periodo as p ON p.idPeriodo = pym.idPeriodo INNER JOIN materias as m ON m.idMateria = pym.idMateria INNER JOIN planes as pl ON m.idPlan = pl.idPlan INNER JOIN carreras as c ON pl.idCarrera = c.idCarrera WHERE pym.idProfesor = ${idProfesor} AND p.fechaInicio >= '${anyoIni}' AND p.fechaFin <= '${anyoFin}';`;
            const respuesta = yield database_1.default.query(consulta);
            res.json(respuesta);
        });
    }
    listMateriasByAnyoByPeriodoMultiple(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, anyoIni, anyoFin } = req.params;
            let resp;
            let consulta = `SELECT pymm.idProfesorYmateriaMultiple,pymm.idMateria, c.nombreCarrera, pl.nombrePlan as plan, p.nombre as nombrePeriodo, p.actual FROM profesorYmateriaMultiple pymm INNER JOIN periodo as p ON p.idPeriodo = pymm.idPeriodo INNER JOIN materias as m ON m.idMateria = pymm.idMateria INNER JOIN planes as pl ON m.idPlan = pl.idPlan INNER JOIN carreras as c ON pl.idCarrera = c.idCarrera WHERE pymm.idProfesor = ${idProfesor} AND p.fechaInicio >= '${anyoIni}' AND p.fechaFin <= '${anyoFin}'`;
            const respuesta = yield database_1.default.query(consulta);
            for (let i = 0; i < respuesta.length; i++) {
                resp = yield database_1.default.query(`SELECT grupo FROM gruposmultiples WHERE idProfesorYMateriaMultiple = ${respuesta[i].idProfesorYMateriaMultiple}`);
                respuesta[i].grupos = [];
                delete respuesta[i].idProfesorYMateriaMultiple;
                resp.forEach((element) => {
                    respuesta[i].grupos.push(element.grupo);
                });
            }
            res.json(respuesta);
        });
    }
    listMateriasMultiplesByCarreraByPeriodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idCarrera, idPeriodo } = req.params;
            let consulta = `SELECT p.idProfesor, p.nombreProfesor FROM profesores as p INNER JOIN profesorYmateriaMultiple as pymm on pymm.idProfesor = p.idProfesor INNER JOIN periodo as pe ON pe.idPeriodo = pymm.idPeriodo INNER JOIN materias as m ON m.idMateria = pymm.idMateria INNER JOIN planes as pla ON pla.idPlan = m.idPlan INNER JOIN carreras as ca ON ca.idCarrera = pla.idCarrera WHERE ca.idCarrera = ${idCarrera} AND pe.idPeriodo = ${idPeriodo}`;
            const respuestaProfesores = yield database_1.default.query(consulta);
            for (let i = 0; i < respuestaProfesores.length; i++) {
                let consulta = `SELECT pymm.idMateria,pymm.idProfesorYMateriaMultiple,ma.semestre, pla.idPlan, ma.nombreMateria, ca.nombreCarrera, pe.nombre FROM profesorYmateriaMultiple as pymm INNER JOIN periodo as pe ON pymm.idPeriodo = pe.idPeriodo INNER JOIN materias as ma ON ma.idMateria = pymm.idMateria INNER JOIN planes as pla ON ma.idPlan = pla.idPlan INNER JOIN carreras as ca ON pla.idCarrera = ca.idCarrera WHERE pymm.idProfesor = ${respuestaProfesores[i].idProfesor}`;
                const respuestaAtributos = yield database_1.default.query(consulta);
                for (let j = 0; j < respuestaAtributos.length; j++) {
                    let consulta = `SELECT * FROM gruposMultiples WHERE idProfesorYMateriaMultiple = ${respuestaAtributos[j].idProfesorYMateriaMultiple}`;
                    const respuestaGrupos = yield database_1.default.query(consulta);
                    respuestaAtributos[j].grupos = respuestaGrupos;
                }
                respuestaProfesores[i].atributos = respuestaAtributos;
            }
            res.json(respuestaProfesores);
        });
    }
}
exports.materiasController = new MateriasController();
