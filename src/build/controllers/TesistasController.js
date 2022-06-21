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
            resp = yield database_1.default.query('INSERT INTO profesorYTesis SET ?', dato);
            res.json(resp);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            let resp = yield database_1.default.query(`DELETE FROM profesorYTesis WHERE idTesis = ${id}`);
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
            const resp = yield database_1.default.query(`SELECT DISTINCT t.* FROM tesistas AS t INNER JOIN profesorYTesis AS pyt INNER JOIN profesores AS p WHERE pyt.idProfesor=${idProfesor} AND t.idTesis=pyt.idTesis AND t.inicio >= '${fechaIni}' and t.inicio <= '${fechaFin}'`);
            for (var i = 0; i < resp.length; i++) {
                const respColab = yield database_1.default.query(`SELECT idProfesor,esInterno FROM profesorYTesis where profesorYTesis.idTesis=${resp[i].idTesis} ORDER BY pos ASC`);
                console.log(respColab);
                let aux = [];
                for (var j = 0; j < respColab.length; j++) {
                    if (respColab[j].esInterno == "0") {
                        respNombres = yield database_1.default.query(`SELECT nombreCodirector FROM externocodirector WHERE idExternoCodirector = ${respColab[j].idProfesor};`);
                    }
                    else {
                        respNombres = yield database_1.default.query(`SELECT nombreProfesor FROM profesores where profesores.idProfesor=${respColab[j].idProfesor}`);
                    }
                    aux.push(respNombres);
                }
                resp[i].nombreProfesor = aux;
            }
            console.log(aux2);
            //console.log(aux)
            res.json(resp);
        });
    }
}
exports.tesistasController = new TesistasController();
