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
exports.articulosController = void 0;
const database_1 = __importDefault(require("../database"));
class ArticulosController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT * FROM articulos order by idArticulo');
            res.json(respuesta);
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respuesta = yield database_1.default.query('SELECT * FROM articulos WHERE idArticulo = ?', [id]);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'mensaje': 'Articulo no encontrado' });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, fecha } = req.params;
            const resp = yield database_1.default.query('INSERT INTO articulos SET ?', [req.body]);
            let dato = {
                idProfesor: idProfesor,
                idArticulo: resp.insertId,
                pos: 1,
                validado: 1,
                fechaModificacion: fecha,
                esInterno: 1
            };
            const resp2 = yield database_1.default.query('INSERT INTO profesorYarticulo SET ?', dato);
            res.json(resp2);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idArticulo } = req.params;
            let resp = yield database_1.default.query(`DELETE FROM profesorYarticulo WHERE idArticulo=${idArticulo}`);
            resp = yield database_1.default.query(`DELETE FROM articulos WHERE idArticulo=${idArticulo}`);
            res.json(resp);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idArticulo } = req.params;
            const resp = yield database_1.default.query('UPDATE articulos set ? WHERE idArticulo=?', [req.body, idArticulo]);
            res.json(resp);
        });
    }
    listArticulosByProfesorByPeriodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, fechaIni, fechaFin } = req.params;
            let respuestaAutores;
            let respuesta = yield database_1.default.query(`SELECT A.idArticulo, A.tipoCRL, A.titulo, A.fechaedicion, A.estado, A.anyo FROM articulos as A INNER JOIN profesorYarticulo PA ON PA.idArticulo=A.idArticulo WHERE PA.idProfesor=${idProfesor} AND fechaedicion >= '${fechaIni}' AND fechaedicion <= '${fechaFin}'`);
            // Obtener los profesores participantes
            for (let i = 0; i < respuesta.length; i++) {
                //Obtenemos los autores del articulo
                const respuestaProfesores = yield database_1.default.query('SELECT PA.* FROM profesorYarticulo AS PA WHERE PA.idArticulo = ? ORDER BY PA.pos', respuesta[i].idArticulo);
                let aux = []; //Usamos un arreglo auxiliar para meter los autores 
                for (let j = 0; j < respuestaProfesores.length; j++) {
                    if (respuestaProfesores[j].esInterno == 1) {
                        respuestaAutores = yield database_1.default.query(`SELECT P.idProfesor, P.nombreProfesor, P.nombreApa, PA.pos, PA.validado, PA.fechaModificacion, PA.esInterno FROM profesores as P INNER JOIN profesorYarticulo PA ON PA.idProfesor = P.idProfesor WHERE PA.idArticulo = ${respuesta[i].idArticulo} AND PA.idProfesor = ${respuestaProfesores[j].idProfesor}`);
                    }
                    else {
                        respuestaAutores = yield database_1.default.query(`SELECT PA.idProfesor, EA.nombre AS nombreProfesor, EA.nombreAPA AS nombreApa, PA.pos, PA.validado, PA.fechaModificacion, PA.esInterno FROM externosAPA as EA INNER JOIN profesorYarticulo PA ON PA.idProfesor = EA.idExternoAPA WHERE PA.idProfesor = '${respuestaProfesores[j].idProfesor}' AND PA.idArticulo = '${respuesta[i].idArticulo}'`);
                    }
                    aux.push(respuestaAutores[0]);
                }
                respuesta[i].autores = aux;
            }
            res.json(respuesta);
        });
    }
    listArticulosByCarreraBytipo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, fechaIni, fechaFin, tipo } = req.params;
            let respuestaAutores;
            let respuesta = yield database_1.default.query(`SELECT A.idArticulo, A.tipoCRL, A.titulo, A.fechaedicion, A.estado, A.anyo FROM articulos as A INNER JOIN profesorYarticulo PA ON PA.idArticulo=A.idArticulo WHERE PA.idProfesor=${idProfesor} AND fechaedicion >= '${fechaIni}' AND fechaedicion <= '${fechaFin}' AND tipoCRL = '${tipo}' ORDER BY A.tipoCRL ASC`);
            // Obtener los profesores participantes
            for (let i = 0; i < respuesta.length; i++) {
                //Obtenemos los autores del articulo
                const respuestaProfesores = yield database_1.default.query(`SELECT PA.* FROM profesorYarticulo AS PA WHERE PA.idArticulo = ${respuesta[i].idArticulo} ORDER BY PA.pos`);
                let aux = []; //Usamos un arreglo auxiliar para meter los autores 
                for (let j = 0; j < respuestaProfesores.length; j++) {
                    if (respuestaProfesores[j].esInterno == 1) {
                        respuestaAutores = yield database_1.default.query(`SELECT P.idProfesor, P.nombreProfesor, P.nombreApa, PA.pos, PA.validado, PA.fechaModificacion, PA.esInterno FROM profesores as P INNER JOIN profesorYarticulo PA ON PA.idProfesor = P.idProfesor WHERE PA.idArticulo = ${respuesta[i].idArticulo} AND PA.idProfesor = ${respuestaProfesores[j].idProfesor}`);
                    }
                    else {
                        respuestaAutores = yield database_1.default.query(`SELECT PA.idProfesor, EA.nombre AS nombreProfesor, EA.nombreAPA AS nombreApa, PA.pos, PA.validado, PA.fechaModificacion, PA.esInterno FROM externosAPA as EA INNER JOIN profesorYarticulo PA ON PA.idProfesor = EA.idExternoAPA WHERE PA.idProfesor = '${respuestaProfesores[j].idProfesor}' AND PA.idArticulo = '${respuesta[i].idArticulo}'`);
                    }
                    aux.push(respuestaAutores[0]);
                }
                respuesta[i].autores = aux;
            }
            res.json(respuesta);
        });
    }
    getArticulosByInstituto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idInstituto } = req.params;
            let respuesta = yield database_1.default.query(`SELECT A.* FROM articulos as A INNER JOIN profesorYarticulo PA ON PA.idArticulo=A.idArticulo INNER JOIN profesores P ON P.idProfesor=PA.idProfesor WHERE P.idInstituto=${idInstituto}`);
            // Obtener los profesores participantes y archivos subidos
            for (let i = 0; i < respuesta.length; i++) {
                const respuesta2 = yield database_1.default.query('SELECT P.idProfesor, P.nombreProfesor, P.nombreApa, PA.pos FROM profesores as P INNER JOIN profesorYarticulo PA ON PA.idProfesor=P.idProfesor WHERE PA.idArticulo=? ORDER BY PA.pos', respuesta[i].idArticulo);
                respuesta[i].autores = respuesta2;
            }
            res.json(respuesta);
        });
    }
    getArticulosByInstitutoByFecha(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idInstituto, fechaIni, fechaFin } = req.params;
            let respuesta = yield database_1.default.query(`SELECT A.* FROM articulos as A INNER JOIN profesorYarticulo PA ON PA.idArticulo=A.idArticulo INNER JOIN profesores P ON P.idProfesor=PA.idProfesor WHERE P.idInstituto=${idInstituto} AND fechaedicion >= '${fechaIni}' AND fechaedicion <= '${fechaFin}'`);
            // Obtener los profesores participantes
            for (let i = 0; i < respuesta.length; i++) {
                const respuesta2 = yield database_1.default.query('SELECT P.idProfesor, P.nombreProfesor, P.nombreApa, PA.pos FROM profesores as P INNER JOIN profesorYarticulo PA ON PA.idProfesor=P.idProfesor WHERE PA.idArticulo=? ORDER BY PA.pos', respuesta[i].idArticulo);
                respuesta[i].autores = respuesta2;
            }
            res.json(respuesta);
        });
    }
    listArticulosByCarreraByPeriodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idCarrera, fechaIni, fechaFin } = req.params;
            let respuestaAutores;
            let respuesta = yield database_1.default.query(`SELECT DISTINCT A.idArticulo,A.titulo,A.tipoCRL,A.estado,A.anyo,A.fechaedicion FROM articulos as A INNER JOIN profesorYarticulo PA ON PA.idArticulo=A.idArticulo INNER JOIN profesores P ON P.idProfesor=PA.idProfesor WHERE P.idCarrera=${idCarrera} AND PA.esInterno = 1 AND fechaedicion >= '${fechaIni}' AND fechaedicion <= '${fechaFin}'`);
            // Obtener los profesores participantes
            for (let i = 0; i < respuesta.length; i++) {
                //Obtenemos los autores del articulo
                const respuestaProfesores = yield database_1.default.query(`SELECT PA.* FROM profesorYarticulo AS PA WHERE PA.idArticulo = ${respuesta[i].idArticulo} ORDER BY PA.pos`);
                let aux = []; //Usamos un arreglo auxiliar para meter los autores 
                for (let j = 0; j < respuestaProfesores.length; j++) {
                    if (respuestaProfesores[j].esInterno == 1) {
                        respuestaAutores = yield database_1.default.query(`SELECT P.idProfesor, P.nombreProfesor AS nombreProfesor, P.nombreApa, PA.pos, PA.validado, PA.esInterno, PA.fechaModificacion FROM profesores as P INNER JOIN profesorYarticulo PA ON PA.idProfesor = P.idProfesor WHERE PA.idArticulo = ${respuesta[i].idArticulo} AND PA.idProfesor = ${respuestaProfesores[j].idProfesor}`);
                    }
                    else {
                        respuestaAutores = yield database_1.default.query(`SELECT PA.idProfesor, EA.nombre AS nombreProfesor, EA.nombreAPA AS nombreApa, PA.pos, PA.validado, PA.esInterno, PA.fechaModificacion FROM externosAPA as EA INNER JOIN profesorYarticulo PA ON PA.idProfesor = EA.idExternoAPA WHERE PA.idProfesor = '${respuestaProfesores[j].idProfesor}' AND PA.idArticulo = '${respuesta[i].idArticulo}'`);
                    }
                    aux.push(respuestaAutores[0]);
                }
                respuesta[i].autores = aux;
            }
            res.json(respuesta);
        });
    }
    getTodoPorInsituto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idInstituto, fechaIni, fechaFin } = req.params;
            let respuesta = yield database_1.default.query(`SELECT A.* FROM articulos as A INNER JOIN profesorYarticulo PA ON PA.idArticulo=A.idArticulo INNER JOIN profesores P ON P.idProfesor=PA.idProfesor WHERE PA.pos=1 AND P.idInstituto=${idInstituto} AND fechaedicion >= '${fechaIni}' AND fechaedicion <= '${fechaFin}'`);
            // Obtener los profesores participantes
            for (let i = 0; i < respuesta.length; i++) {
                const respuesta2 = yield database_1.default.query('SELECT P.idProfesor, P.nombreProfesor, P.nombreApa, PA.pos FROM profesores as P INNER JOIN profesorYarticulo PA ON PA.idProfesor=P.idProfesor WHERE PA.idArticulo=? ORDER BY PA.pos', respuesta[i].idArticulo);
                respuesta[i].autores = respuesta2;
            }
            res.json(respuesta);
        });
    }
    getTodoDivididoInstituto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let respuesta = yield database_1.default.query(`SELECT A.*, I.nombreInstituto FROM articulos as A INNER JOIN profesorYarticulo PA ON PA.idArticulo=A.idArticulo INNER JOIN profesores P ON P.idProfesor=PA.idProfesor AND PA.pos=1 INNER JOIN institutos I ON P.idInstituto=I.idInstituto WHERE I.idInstituto > 0 ORDER BY I.idInstituto;`);
            // Obtener los profesores participantes
            for (let i = 0; i < respuesta.length; i++) {
                const respuesta2 = yield database_1.default.query('SELECT P.idProfesor, P.nombreProfesor, P.nombreApa, PA.pos FROM profesores as P INNER JOIN profesorYarticulo PA ON PA.idProfesor=P.idProfesor WHERE PA.idArticulo=? ORDER BY PA.pos', respuesta[i].idArticulo);
                respuesta[i].autores = respuesta2;
            }
            res.json(respuesta);
        });
    }
    getTodoDivididoInstitutoPorFecha(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fechaIni, fechaFin } = req.params;
            let respuesta = yield database_1.default.query(`SELECT A.*, I.nombreInstituto FROM articulos as A INNER JOIN profesorYarticulo PA ON PA.idArticulo=A.idArticulo INNER JOIN profesores P ON P.idProfesor=PA.idProfesor AND PA.pos=1 INNER JOIN institutos I ON P.idInstituto=I.idInstituto WHERE I.idInstituto > 0 AND A.fechaedicion>='${fechaIni}' AND A.fechaedicion<='${fechaFin}' ORDER BY I.idInstituto;`);
            // Obtener los profesores participantes
            for (let i = 0; i < respuesta.length; i++) {
                const respuesta2 = yield database_1.default.query('SELECT P.idProfesor, P.nombreProfesor, P.nombreApa, PA.pos FROM profesores as P INNER JOIN profesorYarticulo PA ON PA.idProfesor=P.idProfesor WHERE PA.idArticulo=? ORDER BY PA.pos', respuesta[i].idArticulo);
                respuesta[i].autores = respuesta2;
            }
            res.json(respuesta);
        });
    }
    listByPeriodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fechaIni, fechaFin } = req.params;
            const respuesta = yield database_1.default.query(`SELECT * FROM articulos WHERE fechaedicion >= "${fechaIni}" AND fechaedicion <= "${fechaFin}"`);
            if (respuesta.length > 0) {
                res.json(respuesta);
                return;
            }
            res.json({ 'mensaje': 'Articulos no encontrados' });
        });
    }
    getSugerenciasExternoByAutorUTM(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor } = req.params;
            let listexternos = yield database_1.default.query(`SELECT DISTINCT EA.* FROM externosAPA AS EA INNER JOIN profesorYarticulo PAE ON EA.idExternoAPA = PAE.idProfesor INNER JOIN profesorYarticulo PAO ON PAE.idArticulo = PAO.idArticulo WHERE PAE.esInterno = 0 AND PAO.esInterno!=0 AND PAO.idProfesor = ${idProfesor}`);
            res.json(listexternos);
        });
    }
    addAutorExterno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idArticulo, fecha } = req.params;
            let profesor = req.body;
            let resp = yield database_1.default.query(`INSERT INTO profesorYarticulo (idProfesor, idArticulo, pos, validado, fechaModificacion, esInterno) VALUES ('${profesor.idExternoAPA}','${idArticulo}', '${profesor.pos}','1', '${fecha}', '0')`);
            res.json(resp);
        });
    }
    listAutoresExternosExistentesSinColaboracionArticulos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor } = req.params;
            let consulta = `SELECT t1.idExternoAPA, t1.nombreAPA, t1.correo, t1.nombre FROM externosAPA as t1 LEFT OUTER JOIN (SELECT * FROM profesorYarticulo as pya INNER JOIN externosAPA as eapa ON pya.idProfesor = eapa.idExternoAPA WHERE idArticulo = ANY (SELECT idArticulo from profesorYarticulo WHERE idProfesor = ${idProfesor} AND esInterno = 1) AND esInterno = 0) as t2 on t1.idExternoAPA = t2.idExternoAPA WHERE t2.idExternoAPA IS NULL`;
            let resp = yield database_1.default.query(consulta);
            res.json(resp);
        });
    }
    listArticulosByProfesorByPeriodoByTitulo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, fechaIni, fechaFin } = req.params;
            let respuestaAutores;
            let respuesta = yield database_1.default.query(`SELECT A.idArticulo, A.tipoCRL, A.titulo, A.fechaedicion, A.estado, A.anyo FROM articulos as A INNER JOIN profesorYarticulo PA ON PA.idArticulo=A.idArticulo WHERE PA.idProfesor=${idProfesor} AND A.fechaedicion >= '${fechaIni}' AND A.fechaedicion <= '${fechaFin}' AND PA.esInterno=1 ORDER BY A.titulo ASC`);
            // Obtener los profesores participantes
            for (let i = 0; i < respuesta.length; i++) {
                //Obtenemos los autores del articulo
                let respuestaProfesores = yield database_1.default.query(`SELECT PA.* FROM profesorYarticulo AS PA WHERE PA.idArticulo = ${respuesta[i].idArticulo} ORDER BY PA.pos ASC`);
                let aux = []; //Usamos un arreglo auxiliar para meter los autores 
                for (let j = 0; j < respuestaProfesores.length; j++) {
                    if (respuestaProfesores[j].esInterno == 1) {
                        respuestaAutores = yield database_1.default.query(`SELECT PA.idProfesor, P.nombreProfesor AS nombre, P.nombreApa, PA.pos, PA.esInterno FROM profesores as P INNER JOIN profesorYarticulo PA ON PA.idProfesor = P.idProfesor WHERE PA.esInterno=1 AND P.idProfesor = ${respuestaProfesores[j].idProfesor} AND PA.idArticulo=${respuestaProfesores[j].idArticulo}`);
                    }
                    else {
                        respuestaAutores = yield database_1.default.query(`SELECT PA.idProfesor, EA.nombre, EA.nombreAPA AS nombreApa, PA.pos, PA.esInterno FROM externosAPA as EA INNER JOIN profesorYarticulo PA ON PA.idProfesor = EA.idExternoAPA WHERE PA.esInterno=0 AND EA.idExternoAPA = ${respuestaProfesores[j].idProfesor} AND PA.idArticulo=${respuestaProfesores[j].idArticulo}`);
                    }
                    aux.push(respuestaAutores[0]);
                }
                respuesta[i].autores = aux;
            }
            res.json(respuesta);
        });
    }
    listProfesoresByInstitutoNoAutores(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idInstituto, idArticulo } = req.params;
            let respuesta = [];
            let idAutores = [];
            //Obtenemos los idAutores de los autores del articulo del instituto dado
            let respuestaAutores = yield database_1.default.query(`SELECT P.idProfesor FROM profesores AS P INNER JOIN profesoryarticulo PA ON P.idProfesor = PA.idProfesor WHERE PA.idArticulo = ${idArticulo} AND P.idInstituto = ${idInstituto}`);
            //Ponemos los id en un arreglo
            respuestaAutores.forEach((element) => {
                idAutores.push(element.idProfesor);
            });
            //Obtenemos los autores del instituto deseado
            let respuestaProfesores = yield database_1.default.query("SELECT idProfesor, nombreProfesor, nombreApa FROM profesores WHERE idInstituto = ?", idInstituto);
            //Recorremos los profesores para filtrar por los autores del articulo
            for (let i = 0; i < respuestaProfesores.length; i++) {
                const element = respuestaProfesores[i];
                //Si no esta dentro de los id de los autores entonces lo añade al JSON de respuesta
                if (!idAutores.includes(element.idProfesor)) {
                    respuesta.push(element);
                }
            }
            res.json(respuesta);
        });
    }
    listArticulosByProfesorByPeriodoByAnyo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, fechaIni, fechaFin } = req.params;
            let respuesta = yield database_1.default.query(`SELECT A.idArticulo, A.tipoCRL, A.titulo, A.estado, A.anyo FROM articulos as A INNER JOIN profesorYarticulo PA ON PA.idArticulo=A.idArticulo WHERE PA.idProfesor=${idProfesor} AND fechaedicion >= '${fechaIni}' AND fechaedicion <= '${fechaFin}' ORDER BY A.anyo ASC`);
            for (let i = 0; i < respuesta.length; i++) {
                const respuestaProfesores = yield database_1.default.query('SELECT PA.* FROM profesorYarticulo AS PA WHERE PA.idArticulo = ? ORDER BY PA.pos ASC', respuesta[i].idArticulo);
                let aux = [];
                for (let j = 0; j < respuestaProfesores.length; j++) {
                    let respuestaAutores;
                    if (respuestaProfesores[j].esInterno == 1) {
                        respuestaAutores = yield database_1.default.query(`SELECT P.idProfesor, P.nombreProfesor, P.nombreApa, PA.pos, PA.validado, PA.fechaModificacion, PA.esInterno FROM profesores as P INNER JOIN profesorYarticulo PA ON PA.idProfesor = P.idProfesor WHERE P.idProfesor = ${respuestaProfesores[j].idProfesor} AND PA.idArticulo = ${respuesta[i].idArticulo}`);
                    }
                    else {
                        respuestaAutores = yield database_1.default.query(`SELECT PA.idProfesor, EA.nombre AS nombreProfesor, EA.nombreAPA AS nombreApa, PA.pos, PA.validado, PA.fechaModificacion, PA.esInterno FROM externosAPA as EA INNER JOIN profesorYarticulo PA ON PA.idProfesor = EA.idExternoAPA WHERE PA.idProfesor = ${respuestaProfesores[j].idProfesor} AND PA.idArticulo = ${respuesta[i].idArticulo}`);
                    }
                    aux.push(respuestaAutores[0]);
                }
                respuesta[i].autores = aux;
            }
            res.json(respuesta);
        });
    }
    //listArticulosByProfesorByPeriodoByEstado
    listArticulosByProfesorByPeriodoByEstado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, fechaIni, fechaFin } = req.params;
            let respNombres;
            let aux2 = [];
            const resp = yield database_1.default.query(`SELECT DISTINCT t.* FROM Articulos AS t INNER JOIN profesorYarticulo AS pyt INNER JOIN profesores AS p WHERE pyt.idProfesor=${idProfesor} AND t.idArticulo=pyt.idArticulo AND t.fechaedicion >= '${fechaIni}' and t.fechaedicion <= '${fechaFin}' AND pyt.esInterno=1 ORDER BY t.estado`);
            for (var i = 0; i < resp.length; i++) {
                const respColab = yield database_1.default.query(`SELECT idProfesor,esInterno FROM profesorYarticulo where profesorYarticulo.idArticulo=${resp[i].idArticulo} ORDER BY pos ASC`);
                let aux = [];
                for (var j = 0; j < respColab.length; j++) {
                    if (respColab[j].esInterno == "0") {
                        respNombres = yield database_1.default.query(`SELECT nombre AS nombreProfesor, nombreAPA,idExternoApa AS idProfesor, esInterno,pos FROM externosAPA INNER JOIN profesorYarticulo AS pya WHERE idProfesor = ${respColab[j].idProfesor} AND pya.idProfesor=${respColab[j].idProfesor} AND pya.idArticulo = ${resp[i].idArticulo}`);
                    }
                    else {
                        respNombres = yield database_1.default.query(`SELECT nombreProfesor, nombreAPA, p.idProfesor, esInterno,pos FROM profesores AS p INNER JOIN profesorYarticulo AS pya WHERE p.idProfesor=${respColab[j].idProfesor} AND pya.idProfesor=${respColab[j].idProfesor} AND pya.idArticulo = ${resp[i].idArticulo}`);
                    }
                    aux.push(respNombres[0]);
                }
                resp[i].profesores = aux;
            }
            res.json(resp);
        });
    }
}
exports.articulosController = new ArticulosController();
