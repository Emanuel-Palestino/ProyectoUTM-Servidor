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
exports.profesorYArticuloController = void 0;
const database_1 = __importDefault(require("../database"));
class ProfesorYArticuloController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT * FROM profesorYarticulo order by idArticuloYProfesor');
            res.json(respuesta);
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respuesta = yield database_1.default.query('SELECT * FROM profesorYarticulo WHERE idArticuloYProfesor = ?', [id]);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'mensaje': 'Fila no encontrada' });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield database_1.default.query('INSERT INTO profesorYarticulo SET ?', [req.body]);
            res.json(resp);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idArticulo, idProfesor, esInterno } = req.params;
            const resp = yield database_1.default.query(`DELETE FROM profesorYarticulo WHERE idArticulo=${idArticulo} AND idProfesor=${idProfesor} AND esInterno=${esInterno}`);
            res.json(resp);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idArticuloYProfesor } = req.params;
            const resp = yield database_1.default.query('UPDATE profesorYarticulo set ? WHERE idArticuloYProfesor=?', [req.body, idArticuloYProfesor]);
            res.json(resp);
        });
    }
    updatePrioridadesOfAutoresByPublicacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let resp;
            const { idArticulo } = req.params;
            let hoy = new Date();
            let fecha = hoy.getFullYear() + '-' + ('0' + (hoy.getMonth() + 1)).slice(-2) + '-' + ('0' + hoy.getDate()).slice(-2);
            for (let i = 0; i < req.body.length; i++) {
                const utm = req.body[i];
                utm.fechaModificacion = fecha;
                resp = yield database_1.default.query('UPDATE profesorYarticulo set ? WHERE idArticulo = ? AND idProfesor = ? AND esInterno = ?', [utm, idArticulo, utm.idProfesor, utm.esInterno]);
            }
            res.json(resp);
        });
    }
    profesoresByArticulo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idArticulo } = req.params;
            const respuesta = yield database_1.default.query(`SELECT nombres FROM profesores, articulos, profesorYarticulo 
		WHERE articulos.idArticulo=${idArticulo} AND articuloyprofesor.idArticulo = articulos.idArticulo 
		AND articuloyprofesor.idProfesor = profesores.idProfesor;`);
            if (respuesta.length > 0) {
                res.json(respuesta);
                return;
            }
            res.status(404).json({ 'mensaje': 'Articulo no encontrado' });
        });
    }
    articulosByCarrera(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idCarrera } = req.params;
            const respuesta = yield database_1.default.query(`SELECT nombreArticulo FROM profesores, articulos, profesorYarticulo 
		WHERE profesores.idCarrera=${idCarrera} AND articuloyprofesor.idArticulo = articulos.idArticulo 
		AND articuloyprofesor.idProfesor = profesores.idProfesor;`);
            if (respuesta.length > 0) {
                res.json(respuesta);
                return;
            }
            res.status(404).json({ 'mensaje': 'Articulos no encontrados' });
        });
    }
    createExterno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idArticulo, pos } = req.params;
            const resp = yield database_1.default.query('INSERT INTO externosAPA SET ?', [req.body]);
            let hoy = new Date();
            let dato = {
                idProfesor: resp.insertId,
                idArticulo: idArticulo,
                pos: pos,
                validado: 1,
                fechaModificacion: hoy.getFullYear() + '-' + ('0' + (hoy.getMonth() + 1)).slice(-2) + '-' + ('0' + hoy.getDate()).slice(-2),
                esInterno: 0,
            };
            const resp2 = yield database_1.default.query('INSERT INTO profesorYarticulo SET ?', dato);
            res.json(resp2);
        });
    }
    addAutoresUTM(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idArticulo } = req.params;
            let profesores = req.body;
            let resp;
            let hoy = new Date();
            let fecha = (hoy.getFullYear() + '-' + ('0' + (hoy.getMonth() + 1)).slice(-2) + '-' + ('0' + hoy.getDate()).slice(-2));
            for (var i = 0; i < profesores.length; i++) {
                resp = yield database_1.default.query(`INSERT INTO profesorYarticulo (idProfesor, idArticulo, pos, validado, fechaModificacion, esInterno) VALUES (${profesores[i].idProfesor},${idArticulo}, ${profesores[i].pos},'1', '${fecha}', '1')`);
            }
            res.json(resp);
        });
    }
    listProfesorYArticulo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idArticulo } = req.params;
            const respuesta = yield database_1.default.query(`SELECT idProfesor,pos FROM profesorYarticulo WHERE idArticulo = ${idArticulo} ORDER BY pos ASC`);
            res.json(respuesta);
        });
    }
}
exports.profesorYArticuloController = new ProfesorYArticuloController();
