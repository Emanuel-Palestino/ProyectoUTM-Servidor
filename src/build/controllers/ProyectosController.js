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
            const { idProfesor } = req.params;
            const resp = yield database_1.default.query('INSERT INTO proyectos SET ?', [req.body]);
            let dato = {
                idProfesor: idProfesor,
                idProyecto: resp.insertId,
                pos: 1,
                esInterno: 1
            };
            const resp2 = yield database_1.default.query('INSERT INTO profesorYproyecto SET ?', dato);
            res.json(resp2);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProyecto } = req.params;
            let resp = yield database_1.default.query(`DELETE FROM profesorYproyecto WHERE idProyecto=${idProyecto}`);
            resp = yield database_1.default.query(`DELETE FROM proyectos WHERE idProyecto=${idProyecto}`);
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
            let consulta = `SELECT ep.idExternoProyecto as idExterno, ep.nombreExterno FROM profesorYproyecto as pyp INNER JOIN externosproyecto as ep ON pyp.idProfesor = ep.idExternoProyecto WHERE idProyecto = ANY (SELECT idProyecto from profesorYproyecto WHERE idProfesor = ${idProfesor} AND esInterno = 1) AND esInterno = 0;`;
            const resp = yield database_1.default.query(consulta);
            res.json(resp);
        });
    }
    listColaboradoresExternosSinColaboracionProyectos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor } = req.params;
            let consulta = `SELECT ep.idExternoProyecto as idExterno, ep.nombreExterno FROM profesorYproyecto as pyp INNER JOIN externosproyecto as ep ON pyp.idProfesor = ep.idExternoProyecto WHERE ep.idExternoProyecto NOT IN (SELECT ep.idExternoProyecto FROM profesorYproyecto as pyp INNER JOIN externosproyecto as ep ON pyp.idProfesor = ep.idExternoProyecto WHERE idProyecto = ANY (SELECT idProyecto from profesorYproyecto WHERE idProfesor = ${idProfesor} AND esInterno = 1) AND esInterno = 0) AND esInterno = 0;`;
            const resp = yield database_1.default.query(consulta);
            res.json(resp);
        });
    }
    listColaboradoresInternosProyectos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor } = req.params;
            const respuesta = yield database_1.default.query(`SELECT DISTINCT CE.idProfesor, CE.nombreProfesor, CE.idCarrera, CE.idInstituto FROM profesores AS CE INNER JOIN profesorYproyecto PYP ON CE.idProfesor = PYP.idProfesor INNER JOIN profesorYproyecto P ON P.idProyecto = PYP.idProyecto WHERE PYP.esInterno = 1  AND P.esInterno = 1 AND P.idProfesor = ${idProfesor} AND CE.idProfesor !=${idProfesor}`);
            res.json(respuesta);
        });
    }
    listProyectosByProfesorByPeriodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, fechaIni, fechaFin } = req.params;
            let respuestaColaboradores;
            let respuesta = yield database_1.default.query(`SELECT P.* FROM proyectos as P INNER JOIN profesorYproyecto PP ON PP.idProyecto = P.idProyecto WHERE PP.idProfesor=${idProfesor} AND P.inicio >= '${fechaIni}' AND P.inicio <= '${fechaFin}' AND PP.esInterno=1`);
            //Obtenemos los profesores participantes
            for (let i = 0; i < respuesta.length; i++) {
                //Obtenemos los colaboradores del proyecto
                const respuestaProyectos = yield database_1.default.query('SELECT PP.idProfesor, PP.esInterno FROM profesorYproyecto AS PP WHERE PP.idProyecto = ? ORDER BY PP.pos', respuesta[i].idProyecto);
                let colabs = [];
                for (let j = 0; j < respuestaProyectos.length; j++) {
                    if (respuestaProyectos[j].esInterno == 1) { //Comprobamos si el colaborador es interno de la UTM si el campo esInterno == 1
                        respuestaColaboradores = yield database_1.default.query('SELECT P.nombreProfesor AS nombreProfesor, PP.idProfesor, PP.esInterno, PP.pos FROM profesores as P INNER JOIN profesorYproyecto as PP ON PP.idProfesor = P.idProfesor WHERE PP.idProfesor = ?', respuestaProyectos[j].idProfesor);
                    }
                    else { //Si no es un colaborador externo
                        respuestaColaboradores = yield database_1.default.query('SELECT E.nombreExterno AS nombreProfesor, PP.idProfesor, PP.esInterno, PP.pos FROM externosProyecto as E INNER JOIN profesorYproyecto as PP ON PP.idProfesor = E.idExternoProyecto WHERE E.idExternoProyecto = ?', respuestaProyectos[j].idProfesor);
                    }
                    colabs.push(respuestaColaboradores[0]);
                }
                respuesta[i].colaboradores = colabs;
            }
            res.json(respuesta);
        });
    }
    listProfesoresByInstitutoSinColaboradoresInternosByProyecto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProyecto, idInstituto } = req.params;
            const respuesta = yield database_1.default.query(`SELECT DISTINCT * FROM profesores  WHERE idProfesor NOT IN (SELECT DISTINCT CE.idProfesor FROM profesores AS CE INNER JOIN profesorYproyecto PYP ON CE.idProfesor = PYP.idProfesor INNER JOIN profesorYproyecto P ON P.idProyecto = PYP.idProyecto WHERE PYP.esInterno = 1  AND P.esInterno = 1 AND P.idProyecto = ${idProyecto}) AND idInstituto =${idInstituto}`);
            res.json(respuesta);
        });
    }
    listProyectosByCarreraByPeriodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idCarrera, fechaIni, fechaFin } = req.params;
            let respuestaColaboradores;
            let aux2 = [];
            const respuesta = yield database_1.default.query(`SELECT DISTINCT PP.* FROM proyectos AS PP INNER JOIN profesorYproyecto AS pyt INNER JOIN profesores AS p WHERE pyt.idProfesor=p.idProfesor AND PP.idProyecto=pyt.idProyecto AND PP.inicio >= '${fechaIni}' AND PP.inicio <= '${fechaFin}' AND p.idCarrera = ${idCarrera}`);
            //Obtenemos los profesores participantes
            for (let i = 0; i < respuesta.length; i++) {
                //Obtenemos los colaboradores del proyecto
                const respuestaProyectos = yield database_1.default.query('SELECT PP.idProfesor, PP.esInterno FROM profesorYproyecto AS PP WHERE PP.idProyecto = ? ORDER BY PP.pos', respuesta[i].idProyecto);
                let colabs = [];
                for (let j = 0; j < respuestaProyectos.length; j++) {
                    if (respuestaProyectos[j].esInterno == 1) { //Comprobamos si el colaborador es interno de la UTM si el campo esInterno == 1
                        respuestaColaboradores = yield database_1.default.query('SELECT P.nombreProfesor AS nombreProfesor, PP.idProfesor, PP.esInterno FROM profesores as P INNER JOIN profesorYproyecto as PP ON PP.idProfesor = P.idProfesor WHERE PP.idProfesor = ?', respuestaProyectos[j].idProfesor);
                    }
                    else { //Si no es un colaborador externo
                        respuestaColaboradores = yield database_1.default.query('SELECT E.nombreExterno AS nombreProfesor, PP.idProfesor, PP.esInterno FROM externosProyecto as E INNER JOIN profesorYproyecto as PP ON PP.idProfesor = E.idExternoProyecto WHERE E.idExternoProyecto = ?', respuestaProyectos[j].idProfesor);
                    }
                    colabs.push(respuestaColaboradores[0]);
                }
                respuesta[i].colaboradores = colabs;
            }
            res.json(respuesta);
        });
    }
    updatePrioridadesOfColaboradoresByProyecto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProyecto } = req.params;
            let resp;
            for (let i = 0; i < req.body.length; i++) {
                const utm = req.body[i];
                resp = yield database_1.default.query('UPDATE profesorYproyecto set ? WHERE idProyecto = ? AND idProfesor = ? AND esInterno = ?', [utm, idProyecto, utm.idProfesor, utm.esInterno]);
            }
            res.json(resp);
        });
    }
    createColaboradorExternoProyecto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProyecto } = req.params;
            let datoE = {
                nombreExterno: req.body.nombreExterno,
                correoExterno: req.body.correoExterno
            };
            const resp = yield database_1.default.query('INSERT INTO externosProyecto SET ?', [datoE]);
            let dato = {
                idProfesor: resp.insertId,
                idProyecto: idProyecto,
                pos: req.body.pos,
                esInterno: 0
            };
            const resp2 = yield database_1.default.query('INSERT INTO profesorYproyecto SET ?', dato);
            res.json(resp2);
        });
    }
    addColaboradoresProyectoUTM(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProyec } = req.params;
            const colaboradores = req.body;
            for (let i = 0; i < colaboradores.length; i++) {
                let dato = {
                    idProfesor: colaboradores[i].idProfesor,
                    idProyecto: idProyec,
                    pos: colaboradores[i].pos,
                    esInterno: 1
                };
                const resp2 = yield database_1.default.query('INSERT INTO profesorYproyecto SET ?', dato);
            }
            res.json(colaboradores);
        });
    }
}
exports.proyectosController = new ProyectosController();
