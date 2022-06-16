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
            const { idProfesor } = req.params;
            const resp = yield database_1.default.query('INSERT INTO articulos SET ?', [req.body]);
            let dato = {
                idProfesor: idProfesor,
                idArticulo: resp.insertId,
                posicion: 1
            };
            const resp2 = yield database_1.default.query('INSERT INTO profesorYArticulo SET ?', dato);
            res.json(resp2);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idArticulo } = req.params;
            const resp = yield database_1.default.query(`DELETE FROM articulos WHERE idArticulo=${idArticulo}`);
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
    getArticulosByProfesor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, fechaIni, fechaFin } = req.params;
            let respuesta = yield database_1.default.query(`SELECT A.* FROM articulos as A INNER JOIN profesorYArticulo PA ON PA.idArticulo=A.idArticulo WHERE PA.idProfesor=${idProfesor} AND fechaedicion >= '${fechaIni}' AND fechaedicion <= '${fechaFin}'`);
            // Obtener los profesores participantes
            for (let i = 0; i < respuesta.length; i++) {
                const respuesta2 = yield database_1.default.query('SELECT P.idProfesor, P.nombreProfesor, P.nombreApa, PA.pos  FROM profesores as P INNER JOIN profesorYArticulo PA ON PA.idProfesor=P.idProfesor WHERE PA.idArticulo=? ORDER BY PA.pos', respuesta[i].idArticulo);
                respuesta[i].autores = respuesta2;
                const respuesta3 = yield database_1.default.query('SELECT * FROM archivoyarticulo WHERE idArticulo=?', respuesta[i].idArticulo);
                respuesta[i].archivos = respuesta3;
            }
            res.json(respuesta);
        });
    }
    getArticulosByInstituto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idInstituto } = req.params;
            let respuesta = yield database_1.default.query(`SELECT A.* FROM articulos as A INNER JOIN profesorYArticulo PA ON PA.idArticulo=A.idArticulo INNER JOIN profesores P ON P.idProfesor=PA.idProfesor WHERE P.idInstituto=${idInstituto}`);
            // Obtener los profesores participantes y archivos subidos
            for (let i = 0; i < respuesta.length; i++) {
                const respuesta2 = yield database_1.default.query('SELECT P.idProfesor, P.nombreProfesor, P.nombreApa, PA.pos FROM profesores as P INNER JOIN profesorYArticulo PA ON PA.idProfesor=P.idProfesor WHERE PA.idArticulo=? ORDER BY PA.pos', respuesta[i].idArticulo);
                respuesta[i].autores = respuesta2;
            }
            res.json(respuesta);
        });
    }
    getArticulosByInstitutoByFecha(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idInstituto, fechaIni, fechaFin } = req.params;
            let respuesta = yield database_1.default.query(`SELECT A.* FROM articulos as A INNER JOIN profesorYArticulo PA ON PA.idArticulo=A.idArticulo INNER JOIN profesores P ON P.idProfesor=PA.idProfesor WHERE P.idInstituto=${idInstituto} AND fechaedicion >= '${fechaIni}' AND fechaedicion <= '${fechaFin}'`);
            // Obtener los profesores participantes
            for (let i = 0; i < respuesta.length; i++) {
                const respuesta2 = yield database_1.default.query('SELECT P.idProfesor, P.nombreProfesor, P.nombreApa, PA.pos FROM profesores as P INNER JOIN profesorYArticulo PA ON PA.idProfesor=P.idProfesor WHERE PA.idArticulo=? ORDER BY PA.pos', respuesta[i].idArticulo);
                respuesta[i].autores = respuesta2;
            }
            res.json(respuesta);
        });
    }
    getTodoPorInsituto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idInstituto, fechaIni, fechaFin } = req.params;
            let respuesta = yield database_1.default.query(`SELECT A.* FROM articulos as A INNER JOIN profesorYArticulo PA ON PA.idArticulo=A.idArticulo INNER JOIN profesores P ON P.idProfesor=PA.idProfesor WHERE PA.pos=1 AND P.idInstituto=${idInstituto} AND fechaedicion >= '${fechaIni}' AND fechaedicion <= '${fechaFin}'`);
            // Obtener los profesores participantes
            for (let i = 0; i < respuesta.length; i++) {
                const respuesta2 = yield database_1.default.query('SELECT P.idProfesor, P.nombreProfesor, P.nombreApa, PA.pos FROM profesores as P INNER JOIN profesorYArticulo PA ON PA.idProfesor=P.idProfesor WHERE PA.idArticulo=? ORDER BY PA.pos', respuesta[i].idArticulo);
                respuesta[i].autores = respuesta2;
            }
            res.json(respuesta);
        });
    }
    getTodoDivididoInstituto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let respuesta = yield database_1.default.query(`SELECT A.*, I.nombreInstituto FROM articulos as A INNER JOIN profesorYArticulo PA ON PA.idArticulo=A.idArticulo INNER JOIN profesores P ON P.idProfesor=PA.idProfesor AND PA.pos=1 INNER JOIN institutos I ON P.idInstituto=I.idInstituto WHERE I.idInstituto > 0 ORDER BY I.idInstituto;`);
            // Obtener los profesores participantes
            for (let i = 0; i < respuesta.length; i++) {
                const respuesta2 = yield database_1.default.query('SELECT P.idProfesor, P.nombreProfesor, P.nombreApa, PA.pos FROM profesores as P INNER JOIN profesorYArticulo PA ON PA.idProfesor=P.idProfesor WHERE PA.idArticulo=? ORDER BY PA.pos', respuesta[i].idArticulo);
                respuesta[i].autores = respuesta2;
            }
            res.json(respuesta);
        });
    }
    getTodoDivididoInstitutoPorFecha(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fechaIni, fechaFin } = req.params;
            let respuesta = yield database_1.default.query(`SELECT A.*, I.nombreInstituto FROM articulos as A INNER JOIN profesorYArticulo PA ON PA.idArticulo=A.idArticulo INNER JOIN profesores P ON P.idProfesor=PA.idProfesor AND PA.pos=1 INNER JOIN institutos I ON P.idInstituto=I.idInstituto WHERE I.idInstituto > 0 AND A.fechaedicion>='${fechaIni}' AND A.fechaedicion<='${fechaFin}' ORDER BY I.idInstituto;`);
            // Obtener los profesores participantes
            for (let i = 0; i < respuesta.length; i++) {
                const respuesta2 = yield database_1.default.query('SELECT P.idProfesor, P.nombreProfesor, P.nombreApa, PA.pos FROM profesores as P INNER JOIN profesorYArticulo PA ON PA.idProfesor=P.idProfesor WHERE PA.idArticulo=? ORDER BY PA.pos', respuesta[i].idArticulo);
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
                console.log(respuesta.length);
                res.json(respuesta);
                return;
            }
            res.json({ 'mensaje': 'Articulos no encontrados' });
        });
    }
    getSugerenciasExternoByAutorUTM(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor } = req.params;
            let listexternos = yield database_1.default.query(`SELECT EA.* FROM externosAPA AS EA INNER JOIN profesorYArticulo PAE ON EA.idExternoAPA = PAE.idProfesor INNER JOIN profesorYArticulo PAO ON PAE.idArticulo = PAO.idArticulo WHERE PAE.esInterno = 1 AND PAO.esInterno!=1 AND PAO.idProfesor = ${idProfesor}`);
            res.json(listexternos);
        });
    }
}
exports.articulosController = new ArticulosController();
