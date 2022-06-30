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
exports.profesoresController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = __importDefault(require("../database"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
class ProfesoresController {
    constructor() {
        dotenv_1.default.config();
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT * FROM profesores');
            res.json(respuesta);
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respuesta = yield database_1.default.query('SELECT * FROM profesores WHERE idProfesor=?', [id]);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'mensaje': 'Profesor no encontrado' });
        });
    }
    existe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { correo, password } = req.body;
            let consulta = "SELECT idProfesor,password, nivel FROM profesores WHERE correo = '" + correo + "'";
            const respuesta = yield database_1.default.query(consulta);
            if (respuesta.length > 0) {
                bcryptjs_1.default.compare(password, respuesta[0].password, (err, resEncriptar) => {
                    if (resEncriptar == true) {
                        const token = jsonwebtoken_1.default.sign(correo, process.env.TOKEN_SECRET || 'prueba');
                        res.json({ "idProfesor": respuesta[0].idProfesor, "token": token, "nivel": respuesta[0].nivel });
                    }
                    else
                        res.json(-1);
                    return;
                });
            }
            else
                res.json(-1);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let password = req.body.password;
            var salt = bcryptjs_1.default.genSaltSync(10);
            bcryptjs_1.default.hash(password, salt).then((nuevoPassword) => __awaiter(this, void 0, void 0, function* () {
                req.body.password = nuevoPassword;
                try {
                    const resp = yield database_1.default.query("INSERT INTO profesores set ?", [req.body]);
                    res.json(resp);
                }
                catch (error) {
                    res.status(500).json({ errorSQL: error.sqlMessage, sql: error.sql });
                }
            }));
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor } = req.params;
            const resp = yield database_1.default.query(`DELETE FROM profesores WHERE idProfesor=${idProfesor}`);
            res.json(resp);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor } = req.params;
            const resp = yield database_1.default.query('UPDATE profesores set ? WHERE idProfesor=?', [req.body, idProfesor]);
            res.json(resp);
        });
    }
    getProfesorByCarrera(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idCarrera } = req.params;
            const resp = yield database_1.default.query(`SELECT * FROM profesores WHERE idCarrera = ${idCarrera}`);
            res.json(resp);
        });
    }
    getProfesorByInstituto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idInstituto } = req.params;
            const resp = yield database_1.default.query(`SELECT * FROM profesores WHERE idInstituto = ${idInstituto}`);
            res.json(resp);
        });
    }
    getProfesoresByArticulo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idArticulo } = req.params;
            const respuesta = yield database_1.default.query('SELECT P.nombreProfesor, P.idProfesor FROM profesores as P INNER JOIN profesorYarticulo PA ON PA.idProfesor=P.idProfesor WHERE PA.idArticulo=?', idArticulo);
            res.json(respuesta);
        });
    }
    cambiarContraseña(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let password = req.body.password;
            const { correo } = req.params;
            var salt = bcryptjs_1.default.genSaltSync(10);
            bcryptjs_1.default.hash(password, salt).then(function (nuevoPassword) {
                req.body.password = nuevoPassword;
                let consulta = `UPDATE profesores SET password='${req.body.password}' WHERE correo='${correo}'`;
                const resp = database_1.default.query(consulta);
                res.json(resp);
            });
        });
    }
    updateDatosPersonales(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor } = req.params;
            const correoNuevo = req.body.correo;
            const nombreProfesorNuevo = req.body.nombreProfesor;
            const gradoNuevo = req.body.grado;
            const resp = yield database_1.default.query('UPDATE profesores SET nombreProfesor=?,correo = ?,grado = ? WHERE idProfesor = ?', [nombreProfesorNuevo, correoNuevo, gradoNuevo, idProfesor]);
            res.json(resp);
        });
    }
    listProfesorByInstituto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let resp = yield database_1.default.query(`SELECT * FROM institutos ORDER BY codigoInstituto`);
            for (let i = 0; i < resp.length; i++) {
                resp[i].profesores = yield database_1.default.query(`SELECT * FROM profesores WHERE profesores.idInstituto=${resp[i].idInstituto} ORDER BY idProfesor`);
            }
            res.json(resp);
        });
    }
}
exports.profesoresController = new ProfesoresController();
