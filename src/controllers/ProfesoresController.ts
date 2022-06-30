import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import pool from '../database'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

class ProfesoresController {

	constructor() {
		dotenv.config()
	}

	public async list(req: Request, res: Response): Promise<void> {
		const respuesta = await pool.query('SELECT * FROM profesores')
		res.json(respuesta)
	}

	public async listOne(req: Request, res: Response): Promise<void> {
		const { id } = req.params;
		const respuesta = await pool.query('SELECT * FROM profesores WHERE idProfesor=?', [id])
		if (respuesta.length > 0) {
			res.json(respuesta[0])
			return;
		}
		res.status(404).json({ 'mensaje': 'Profesor no encontrado' })
	}

	public async existe(req: Request, res: Response): Promise<void> {
		const { correo, password } = req.body;
		let consulta = "SELECT idProfesor,password, nivel FROM profesores WHERE correo = '" + correo + "'";
		const respuesta = await pool.query(consulta);
		if (respuesta.length > 0) {
			bcrypt.compare(password, respuesta[0].password, (err, resEncriptar) => {
				if (resEncriptar == true) {
					const token: string = jwt.sign(correo, process.env.TOKEN_SECRET || 'prueba')
					res.json({ "idProfesor": respuesta[0].idProfesor, "token": token, "nivel": respuesta[0].nivel })
				}
				else
					res.json(-1);
				return;
			})
		}
		else
			res.json(-1);
	}

	public async create(req: Request, res: Response): Promise<void> {
		let password = req.body.password as any;
		var salt = bcrypt.genSaltSync(10);
		bcrypt.hash(password, salt).then(async (nuevoPassword) => {
			req.body.password = nuevoPassword;
			try {
				const resp = await pool.query("INSERT INTO profesores set ?", [req.body]);
				res.json(resp);
			} catch (error: any) {
				res.status(500).json({ errorSQL: error.sqlMessage, sql: error.sql })
			}
		})
	}

	public async delete(req: Request, res: Response): Promise<void> {
		const { idProfesor } = req.params
		const resp = await pool.query(`DELETE FROM profesores WHERE idProfesor=${idProfesor}`)
		res.json(resp)
	}

	public async update(req: Request, res: Response): Promise<void> {
		const { idProfesor } = req.params
		const resp = await pool.query('UPDATE profesores set ? WHERE idProfesor=?', [req.body, idProfesor])
		res.json(resp)
	}

	public async getProfesorByCarrera(req: Request, res: Response): Promise<void> {
		const { idCarrera } = req.params
		const resp = await pool.query(`SELECT * FROM profesores WHERE idCarrera = ${idCarrera}`)
		res.json(resp)
	}

	public async getProfesorByInstituto(req: Request, res: Response): Promise<void> {
		const { idInstituto } = req.params
		const resp = await pool.query(`SELECT * FROM profesores WHERE idInstituto = ${idInstituto}`)
		res.json(resp)
	}

	public async getProfesoresByArticulo(req: Request, res: Response): Promise<void> {
		const { idArticulo } = req.params
		const respuesta = await pool.query('SELECT P.nombreProfesor, P.idProfesor FROM profesores as P INNER JOIN profesorYarticulo PA ON PA.idProfesor=P.idProfesor WHERE PA.idArticulo=?', idArticulo)
		res.json(respuesta)
	}

	public async cambiarContraseña(req: Request, res: Response): Promise<void> {
		let password = req.body.password as any
		const { correo } = req.params
		var salt = bcrypt.genSaltSync(10);
		bcrypt.hash(password, salt).then(function (nuevoPassword) {
			req.body.password = nuevoPassword
			let consulta = `UPDATE profesores SET password='${req.body.password}' WHERE correo='${correo}'`
			const resp = pool.query(consulta)
			res.json(resp)
		})
	}

	public async updateDatosPersonales(req: Request, res: Response): Promise<void> {
		const { idProfesor } = req.params;

		const correoNuevo = req.body.correo;
		const nombreProfesorNuevo = req.body.nombreProfesor;
		const gradoNuevo = req.body.grado;

		const resp = await pool.query('UPDATE profesores SET nombreProfesor=?,correo = ?,grado = ? WHERE idProfesor = ?', [nombreProfesorNuevo, correoNuevo, gradoNuevo, idProfesor])

		res.json(resp);
	}

	public async listProfesorByInstituto(req: Request, res: Response): Promise<void> {
		let resp = await pool.query(`SELECT * FROM institutos ORDER BY codigoInstituto`);
		for (let i = 0; i < resp.length; i++) {
			resp[i].profesores = await pool.query(`SELECT * FROM profesores WHERE profesores.idInstituto=${resp[i].idInstituto} ORDER BY idProfesor`);

		}
		res.json(resp)
	}

}

export const profesoresController = new ProfesoresController()