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
exports.tesistasController = void 0;
const database_1 = __importDefault(require("../database"));
class TesistasController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT * FROM tesistas order by idTesis');
            res.json(respuesta);
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            let consulta = 'SELECT * FROM tesistas WHERE idTesis = ' + id;
            const respuesta = yield database_1.default.query(consulta);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'mensaje': 'tesistas no encontrado' });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor } = req.params;
            let resp = yield database_1.default.query("INSERT INTO tesistas set ?", [req.body]);
            let dato = {
                idProfesor: idProfesor,
                idTesis: resp.insertId,
                pos: 1,
                rol: '1',
                esInterno: 1
            };
            resp = yield database_1.default.query('INSERT INTO profesorYtesis SET ?', dato);
            res.json(resp);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            let resp = yield database_1.default.query(`DELETE FROM profesorYtesis WHERE idTesis = ${id}`);
            resp = yield database_1.default.query(`DELETE FROM tesistas WHERE idTesis = ${id}`);
            res.json(resp);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const resp = yield database_1.default.query("UPDATE tesistas set ? WHERE idTesis= ?", [req.body, id]);
            res.json(resp);
        });
    }
    listTesistasByProfesorByPeriodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, fechaIni, fechaFin } = req.params;
            let respNombres;
            let aux2 = [];
            const resp = yield database_1.default.query(`SELECT DISTINCT t.* FROM tesistas AS t INNER JOIN profesorYtesis AS pyt INNER JOIN profesores AS p WHERE pyt.esInterno = 1 and pyt.idProfesor=${idProfesor} AND t.idTesis=pyt.idTesis AND t.inicio >= '${fechaIni}' and t.fin <= '${fechaFin} '`);
            for (var i = 0; i < resp.length; i++) {
                const respColab = yield database_1.default.query(`SELECT idProfesor,esInterno FROM profesorYtesis where profesorYtesis.idTesis=${resp[i].idTesis} ORDER BY pos ASC`);
                let aux = [];
                for (var j = 0; j < respColab.length; j++) {
                    if (respColab[j].esInterno == "0") {
                        respNombres = yield database_1.default.query(`SELECT nombreCodirector AS nombreProfesor, rol, pos, esInterno, idProfesor  FROM externoCodirector INNER JOIN profesorYtesis WHERE idExternoCodirector = ${respColab[j].idProfesor} AND idProfesor=${respColab[j].idProfesor}`);
                    }
                    else {
                        respNombres = yield database_1.default.query(`SELECT nombreProfesor, rol, pos, esInterno, profesores.idProfesor FROM profesores INNER JOIN profesorYtesis WHERE profesores.idProfesor=${respColab[j].idProfesor} AND profesorYtesis.idProfesor=${respColab[j].idProfesor}`);
                    }
                    aux.push(respNombres[0]);
                }
                resp[i].profesores = aux;
            }
            res.json(resp);
        });
    }
    listTesistasByProfesorByPeriodoByInicio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, fechaIni, fechaFin } = req.params;
            let respNombres;
            const resp = yield database_1.default.query(`SELECT DISTINCT t.* FROM tesistas AS t INNER JOIN profesorYtesis AS pyt INNER JOIN profesores AS p WHERE pyt.idProfesor=${idProfesor} AND t.idTesis=pyt.idTesis AND t.inicio >= '${fechaIni}' and t.inicio <= '${fechaFin}' ORDER BY t.inicio ASC`);
            for (var i = 0; i < resp.length; i++) {
                const respColab = yield database_1.default.query(`SELECT * FROM profesorYtesis where profesorYtesis.idTesis=${resp[i].idTesis} ORDER BY rol ASC`);
                let aux = [];
                for (var j = 0; j < respColab.length; j++) {
                    if (respColab[j].esInterno == 0) {
                        respNombres = yield database_1.default.query(`SELECT PT.idProfesor, EC.nombreCodirector AS nombreProfesor, PT.rol, PT.pos, PT.esInterno FROM externoCodirector AS EC INNER JOIN profesorYtesis AS PT ON EC.idExternoCodirector=PT.idProfesor WHERE idExternoCodirector = ${respColab[j].idProfesor} AND PT.esInterno=0 AND PT.idTesis=${resp[i].idTesis}`);
                    }
                    else {
                        respNombres = yield database_1.default.query(`SELECT PT.idProfesor, P.nombreProfesor AS nombreProfesor, PT.rol, PT.pos, PT.esInterno FROM profesores AS P INNER JOIN profesorYtesis AS PT ON P.idProfesor=PT.idProfesor WHERE P.idProfesor=${respColab[j].idProfesor} AND PT.esInterno=1 AND PT.idTesis=${resp[i].idTesis}`);
                    }
                    aux.push(respNombres[0]);
                }
                resp[i].profesores = aux;
            }
            res.json(resp);
        });
    }
    listTesistasByProfesorByPeriodoByStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, fechaIni, fechaFin } = req.params;
            let respNombres;
            let aux2 = [];
            const resp = yield database_1.default.query(`SELECT DISTINCT t.idTesis,t.nombreTesis,t.nombreEstudiante,t.nivel,t.matricula,t.status,t.inicio,t.fin,t.comprobante FROM tesistas AS t INNER JOIN profesorYtesis AS pyt INNER JOIN profesores AS p WHERE pyt.idProfesor=${idProfesor} AND t.idTesis=pyt.idTesis AND t.inicio >= '${fechaIni}' and t.inicio <= '${fechaFin}' ORDER BY t.status ASC`);
            for (var i = 0; i < resp.length; i++) {
                const respColab = yield database_1.default.query(`SELECT idProfesor,esInterno FROM profesorYtesis where profesorYtesis.idTesis=${resp[i].idTesis} ORDER BY rol ASC`);
                let aux = [];
                for (var j = 0; j < respColab.length; j++) {
                    if (respColab[j].esInterno == "0") {
                        respNombres = yield database_1.default.query(`SELECT nombreCodirector AS nombreProfesor, rol, pos, esInterno FROM externoCodirector INNER JOIN profesorYtesis WHERE idExternoCodirector = ${respColab[j].idProfesor} AND idProfesor=${respColab[j].idProfesor}`);
                    }
                    else {
                        respNombres = yield database_1.default.query(`SELECT profesores.idProfesor,nombreProfesor AS nombreProfesor,rol,esInterno,pos FROM profesores INNER JOIN profesorYtesis WHERE profesores.idProfesor=${respColab[j].idProfesor} AND profesorYtesis.idProfesor=${respColab[j].idProfesor}`);
                    }
                    aux.push(respNombres[0]);
                }
                resp[i].profesores = aux;
            }
            res.json(resp);
        });
    }
    listTesistasByCarreraByPeriodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idCarrera, fechaIni, fechaFin } = req.params;
            let respNombres;
            let aux2 = [];
            const resp = yield database_1.default.query(`SELECT DISTINCT t.* FROM tesistas AS t INNER JOIN profesorYtesis AS pyt INNER JOIN profesores AS p WHERE pyt.idProfesor=p.idProfesor AND t.idTesis=pyt.idTesis AND t.inicio >= '${fechaIni}' AND t.inicio <= '${fechaFin}' AND p.idCarrera = ${idCarrera} AND pyt.esInterno=1`);
            for (var i = 0; i < resp.length; i++) {
                const respColab = yield database_1.default.query(`SELECT idProfesor,esInterno FROM profesorYtesis where profesorYtesis.idTesis=${resp[i].idTesis} ORDER BY pos ASC`);
                let aux = [];
                for (var j = 0; j < respColab.length; j++) {
                    if (respColab[j].esInterno == "0") {
                        respNombres = yield database_1.default.query(`SELECT nombreCodirector AS nombreProfesor, rol, pos, esInterno FROM externoCodirector INNER JOIN profesorYtesis WHERE idExternoCodirector = ${respColab[j].idProfesor} AND idProfesor=${respColab[j].idProfesor}`);
                    }
                    else {
                        respNombres = yield database_1.default.query(`SELECT nombreProfesor, rol, pos, esInterno FROM profesores INNER JOIN profesorYtesis WHERE profesores.idProfesor=${respColab[j].idProfesor} AND profesorYtesis.idProfesor=${respColab[j].idProfesor}`);
                    }
                    aux.push(respNombres[0]);
                }
                resp[i].profesores = aux;
            }
            res.json(resp);
        });
    }
    listCodirectoresExternosSugerencias(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //Soym eml Leom Memmsim deml bamckemnd ᕦ(ò_óˇ)ᕤ
            //metodo para obtener los coodirectores Externos que no han coincidido en alguna tesis con el el profesor obtenido a traves de su idProfesor
            const { idProfesor } = req.params;
            const resp = yield database_1.default.query(`SELECT idExternoCodirector, nombreCodirector FROM externoCodirector where idExternoCodirector NOT IN (SELECT idProfesor FROM profesorytesis where idTesis IN (SELECT idTesis FROM profesorytesis where idProfesor=${idProfesor} and esInterno = 1) and esInterno = 0)`);
            res.json(resp);
        });
    }
    listTesistasByProfesorByPeriodoByNombreTesis(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, fechaIni, fechaFin } = req.params;
            let respNombres;
            let aux2 = [];
            const resp = yield database_1.default.query(`SELECT DISTINCT t.idTesis,t.nombreTesis,t.nombreEstudiante,t.nivel,t.matricula,t.status,t.inicio,t.fin,t.comprobante FROM tesistas AS t INNER JOIN profesorYtesis AS pyt INNER JOIN profesores AS p WHERE pyt.idProfesor=${idProfesor} AND t.idTesis=pyt.idTesis AND t.inicio >= '${fechaIni}' and t.inicio <= '${fechaFin}' ORDER BY t.nombreTesis ASC`);
            for (var i = 0; i < resp.length; i++) {
                const respColab = yield database_1.default.query(`SELECT idProfesor,esInterno FROM profesorYtesis where profesorYtesis.idTesis=${resp[i].idTesis} ORDER BY rol ASC`);
                let aux = [];
                for (var j = 0; j < respColab.length; j++) {
                    if (respColab[j].esInterno == "0") {
                        respNombres = yield database_1.default.query(`SELECT nombreCodirector AS nombreProfesor, rol, pos, esInterno FROM externoCodirector INNER JOIN profesorYtesis WHERE idExternoCodirector = ${respColab[j].idProfesor} AND idProfesor=${respColab[j].idProfesor}`);
                    }
                    else {
                        respNombres = yield database_1.default.query(`SELECT nombreProfesor, rol, pos, esInterno FROM profesores INNER JOIN profesorYtesis WHERE profesores.idProfesor=${respColab[j].idProfesor} AND profesorYtesis.idProfesor=${respColab[j].idProfesor}`);
                    }
                    aux.push(respNombres[0]);
                }
                resp[i].profesores = aux;
            }
            res.json(resp);
        });
    }
    listCodirectoresExternos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor } = req.params;
            let consulta = `SELECT t1.idExternoCodirector, t1.nombreCodirector FROM externoCodirector as t1 LEFT OUTER JOIN (SELECT * FROM profesoryTesis as pyt INNER JOIN externoCodirector as eC ON pyt.idProfesor = eC.idExternoCodirector WHERE idTesis = ANY (SELECT idTesis from profesorYtesis WHERE idProfesor = ${idProfesor} AND esInterno = 1) AND esInterno = 0) as t2 on t1.idExternoCodirector = t2.idExternoCodirector WHERE t2.idExternoCodirector IS NULL`;
            let resp = yield database_1.default.query(consulta);
            res.json(resp);
        });
    }
    updatePrioridadesTestistas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let respuesta;
            const { idTesis } = req.params;
            //Recorremos el body con los JSON de la consulta
            for (let i = 0; i < req.body.length; i++) {
                const elementoBody = req.body[i];
                //Actualizamos 
                respuesta = yield database_1.default.query('UPDATE profesorYTesis SET ? WHERE idTesis = ? AND idProfesor = ? AND esInterno = ?', [elementoBody, idTesis, elementoBody.idProfesor, elementoBody.esInterno]);
            }
            res.json(respuesta);
        });
    }
    listNoColaboradoresUTMByCarreraByTesis(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idCarrera, idTesis } = req.params;
            let respuesta = [];
            let idProfesores = [];
            let respuestaAutoresTesis = yield database_1.default.query(`SELECT P.idProfesor FROM profesores AS P INNER JOIN profesorytesis PT ON P.idProfesor = PT.idProfesor WHERE PT.idTesis = ? AND P.idCarrera = ? AND PT.esInterno = 1`, [idTesis, idCarrera]);
            //Pasamos los id a un arreglo
            respuestaAutoresTesis.forEach((element) => {
                idProfesores.push(element.idProfesor);
            });
            //Obtenemos los idProfesores de los profesores de la carrera dada
            let respuestaProfesores = yield database_1.default.query(`SELECT idProfesor, nombreProfesor FROM profesores WHERE idCarrera = ${idCarrera}`);
            //Recorremos los profesores de la carreara para filtrar por los colaboradores de la tesis
            for (let i = 0; i < respuestaProfesores.length; i++) {
                const element = respuestaProfesores[i];
                //Si no esta dentro de los id de los autores entonces añade al JSON de respuesta
                if (!idProfesores.includes(element.idProfesor)) {
                    respuesta.push(element);
                }
            }
            res.json(respuesta);
        });
    }
    addCodirectoresTesistaUTM(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let respuesta;
            const { idTesis } = req.params;
            //Recorremos el body con los JSON de la consulta
            for (let i = 0; i < req.body.length; i++) {
                const profesorYTesis = req.body[i];
                profesorYTesis.idTesis = idTesis;
                profesorYTesis.esInterno = 1;
                //Creamos 
                respuesta = yield database_1.default.query('INSERT INTO profesorYTesis SET ?', [profesorYTesis]);
            }
            res.json(respuesta);
        });
    }
    listProfesoresbyInstitutoNoCodirectores(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idInstituto, idTesis } = req.params;
            let respuesta = [];
            let profesores;
            let coodirectoresTesis;
            let coodirectores = [];
            coodirectoresTesis = yield database_1.default.query(`SELECT P.idProfesor,P.nombreProfesor,P.correo,P.nivel,P.idCarrera,P.grado,P.tipo,P.nombreApa,P.idInstituto FROM profesores AS P INNER JOIN profesorYtesis PT ON P.idProfesor = PT.idProfesor WHERE PT.idTesis = ${idTesis} AND P.idInstituto = ${idInstituto} AND PT.esInterno = 1 ORDER BY P.idProfesor`);
            coodirectoresTesis.forEach((element) => {
                coodirectores.push(element.idProfesor);
            });
            profesores = yield database_1.default.query(`SELECT DISTINCT * FROM profesores WHERE idInstituto = ${idInstituto} ORDER BY idProfesor`);
            for (let i = 0; i < profesores.length; i++) {
                const element = profesores[i];
                if (!coodirectores.includes(element.idProfesor)) {
                    respuesta.push(element);
                }
            }
            res.json(respuesta);
        });
    }
}
exports.tesistasController = new TesistasController();
