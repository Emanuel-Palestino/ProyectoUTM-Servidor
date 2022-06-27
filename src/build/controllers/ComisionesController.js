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
exports.comisionesController = void 0;
const database_1 = __importDefault(require("../database"));
class ComisionesController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT * FROM comisiones order by idComision');
            res.json(respuesta);
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idComision } = req.params; //id para filtrar la consulta
            const respuesta = yield database_1.default.query('SELECT * FROM comisiones WHERE idComision = ?', [idComision]);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'mensaje': 'Comisión no encontrada' });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield database_1.default.query('INSERT INTO comisiones SET ?', [req.body]);
            res.json(resp);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idComision } = req.params;
            let resp = yield database_1.default.query(`DELETE FROM profesorYcomision WHERE idComision = ${idComision}`);
            resp = yield database_1.default.query(`DELETE FROM comisiones WHERE idComision = ${idComision}`);
            res.json(resp);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idComision } = req.params;
            const resp = yield database_1.default.query(`UPDATE comisiones set ? WHERE idComision = ?`, [req.body, idComision]);
            res.json(resp);
        });
    }
    listComisionesByProfesoByPeriodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, fechaIni, fechaFin } = req.params;
            let respuesta = yield database_1.default.query(`SELECT C.nombre,C.asignacion,C.periodo,C.inicio, C.descripcion FROM comisiones as C INNER JOIN profesorYcomision PC ON PC.idComision=C.idComision WHERE PC.idProfesor=${idProfesor} AND inicio >= '${fechaIni}' AND fin <= '${fechaFin}'`);
            res.json(respuesta);
        });
    }
    listComisionesByCarreraByPeriodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idCarrera, fechaIni, fechaFin } = req.params;
            let respuesta = yield database_1.default.query(`SELECT C.idComision, C.nombre,C.descripcion,C.asignacion, C.periodo, C.inicio,C.fin, C.comprobante FROM comisiones as C, profesorYcomision as PC INNER JOIN profesores P ON PC.idProfesor=P.idProfesor WHERE C.idComision=PC.idComision AND P.idCarrera='${idCarrera}' AND C.inicio>='${fechaIni}' AND C.fin<='${fechaFin}'`);
            res.json(respuesta);
        });
    }
    listarComisionesSinAsignar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT * FROM comisiones WHERE NOT EXISTS (SELECT *FROM profesorYcomision WHERE idComision=comisiones.idComision)');
            res.json(respuesta);
        });
    }
}
exports.comisionesController = new ComisionesController();
