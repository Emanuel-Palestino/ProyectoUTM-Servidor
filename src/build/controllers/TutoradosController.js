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
exports.tutoradoController = void 0;
const database_1 = __importDefault(require("../database"));
class TutoradoController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT * FROM tutorado order by idTutorado');
            res.json(respuesta);
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            let consulta = 'SELECT * FROM tutorado WHERE idTutorado = ' + id;
            const respuesta = yield database_1.default.query(consulta);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'mensaje': 'tutorado no encontrado' });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield database_1.default.query("INSERT INTO tutorado set ?", [req.body]);
            res.json(resp);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const resp = yield database_1.default.query(`DELETE FROM tutorado WHERE idTutorado = ${id}`);
            res.json(resp);
        });
    }
    actualizar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idTutorado } = req.params;
            const resp = yield database_1.default.query("UPDATE tutorado set ? WHERE idTutorado= ?", [req.body, idTutorado]);
            res.json(resp);
        });
    }
    listTutoradosByPeriodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, fechaIni, fechaFin } = req.params;
            let respuesta = yield database_1.default.query(`SELECT idProfesor, idTutorado,numero,nivel,idCarrera,estado,inicio,fin,comprobante FROM tutorado WHERE idProfesor='${idProfesor}' AND inicio>='${fechaIni}' AND fin<='${fechaFin}'`);
            res.json(respuesta);
        });
    }
    listTutoradosByCareraByPeriodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idCarrera, fechaIni, fechaFin } = req.params;
            let respuesta = yield database_1.default.query(`SELECT T.*, P.nombreProfesor FROM tutorado as T INNER JOIN profesores P ON T.idProfesor=P.idProfesor WHERE T.idCarrera='${idCarrera}' AND inicio>='${fechaIni}' AND fin<='${fechaFin}'`);
            res.json(respuesta);
        });
    }
}
exports.tutoradoController = new TutoradoController();
