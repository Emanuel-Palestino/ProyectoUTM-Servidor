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
            let consulta = `SELECT pym.idMateria, pym.grupo, c.nombreCarrera, pl.nombrePlan as plan, p.nombre as nombrePeriodo, p.actual FROM profesorYmateria pym INNER JOIN periodo as p ON p.idPeriodo = pym.idPeriodo INNER JOIN materias as m ON m.idMateria = pym.idMateria INNER JOIN planes as pl ON m.idPlan = pl.idPlan INNER JOIN carreras as c ON pl.idCarrera = c.idCarrera WHERE pym.idProfesor = ${idProfesor} AND p.anyo >= '${anyoIni}' AND p.anyo <= '${anyoFin}';`;
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

    listMateriasByPlanBySemestreByPeriodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idPlan, semestre, AnyoI, AnyoF } = req.params;
            let resp;
            let consulta = `SELECT DISTINCT M.nombreMateria, M.semestre FROM profesorYmateria PM INNER JOIN materias AS M ON M.idPlan=${idPlan} AND M.semestre=${semestre} AND M.idMateria=PM.idMateria`;
            //console.log(consulta)
            let respuesta2 = [];
            const respuesta = yield database_1.default.query(consulta);
            console.log(respuesta.length);
            //res.json(respuesta)
            for (let i = 0; i < respuesta.length; i++) {
                respuesta[0].profesores = yield database_1.default.query(`SELECT PR.nombreProfesor,P.anyo,P.nombre FROM ((profesorYmateria AS PM INNER JOIN materias AS M ON M.nombreMateria="${respuesta[i].nombreMateria}" AND M.semestre=${semestre} AND PM.idMateria=M.idMateria) INNER JOIN profesores AS PR ON PM.idProfesor=PR.idProfesor) INNER JOIN periodo AS P ON P.fechaInicio>='${AnyoI}' AND P.fechaFin<='${AnyoF}' AND P.idPeriodo=PM.idPeriodo`);
                //console.log("profes",resp)
                //respuesta[0].profesores=resp;
            }
            //console.log(respuesta)
            res.json(respuesta);
        });
    }

    listMateriasMultiasignacionByPeriodoByProfesor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idPeriodo, idProfesor } = req.params;
            const respuesta = yield database_1.default.query('SELECT p.idProfesor,p.nombreProfesor FROM `profesores`  AS p WHERE p.idProfesor=?', [idProfesor]);
            const materias = yield database_1.default.query('SELECT m.idMateria,pymm.idProfesorYMateriaMultiple,m.semestre,m.idPlan,m.nombreMateria,c.nombreCarrera,pe.nombre FROM gruposMultiples  JOIN profesorYmateriaMultiple AS pymm ON pymm.idProfesorYMateriaMultiple=gruposMultiples.idProfesorYMateriaMultiple JOIN materias AS m ON m.idMateria=pymm.idMateria JOIN periodo AS pe ON pe.idPeriodo=pymm.idPeriodo JOIN carreras AS c ON c.idCarrera=gruposMultiples.idCarrera WHERE pe.idPeriodo=? AND pymm.idProfesor=?', [idPeriodo, idProfesor]);
            const grupos = yield database_1.default.query('SELECT gp.idProfesorYMateriaMultiple,gp.idCarrera,gp.idPlan,gp.semestre,gp.grupo FROM `gruposMultiples` AS gp JOIN profesorYmateriaMultiple AS pymm ON pymm.idProfesorYMateriaMultiple=gp.idProfesorYMateriaMultiple JOIN periodo AS pe ON pe.idPeriodo=pymm.idPeriodo WHERE pe.idPeriodo=? AND pymm.idProfesor=?', [idPeriodo, idProfesor]);
            respuesta[0].materias = materias;
            respuesta[0].grupos = grupos;
            res.json(respuesta);
         });
    }

    listMateriasByCarreraByPeriodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idCarrera, idPeriodo } = req.params;
            let respuestaMaterias;
            let consulta = yield database_1.default.query(`SELECT DISTINCT P.idProfesor, P.nombreProfesor FROM profesores AS P INNER JOIN profesorYmateria AS PM ON PM.idProfesor=P.idProfesor INNER JOIN materias M ON PM.idMateria=M.idMateria INNER JOIN planes AS PL ON PL.idPlan=M.idPlan WHERE PM.idPeriodo=${idPeriodo} AND PL.idCarrera=${idCarrera}`);
            for (let i = 0; i < consulta.length; i++) {
                let resp = yield database_1.default.query(`SELECT PM.idMateria FROM profesorYmateria AS PM WHERE PM.idProfesor=${consulta[i].idProfesor}`);
                let aux = [];
                for (let j = 0; j < resp.length; j++) {
                    respuestaMaterias = yield database_1.default.query(`SELECT M.*, PM.idProfesorYMateria, PM.grupo, C.nombreCarrera FROM materias AS M INNER JOIN profesorYmateria AS PM ON M.idMateria=PM.idMateria INNER JOIN planes AS P ON M.idPlan=P.idPlan INNER JOIN carreras AS C ON P.idCarrera=C.idCarrera WHERE PM.idMateria=${resp[j].idMateria}`);
                    aux.push(respuestaMaterias[0]);
                }
                consulta[i].materias = aux;
            }
            res.json(consulta);
        });
    }
}
exports.materiasController = new MateriasController();
