import { Request, Response } from 'express'
import pool from '../database'

class ProfesorYProyectoController {

	public async list(req: Request, res: Response): Promise<void> {
		const respuesta = await pool.query('SELECT * FROM profesorYproyecto ')
		res.json(respuesta)
	}

	public async listOne(req: Request, res: Response): Promise<void> {
		const { idProyecto, idProfesor } = req.params;
		const respuesta = await pool.query('SELECT * FROM profesorYproyecto WHERE idProyecto = ? AND idProfesor = ?', [idProyecto, idProfesor])
		if (respuesta.length > 0) {
			res.json(respuesta[0])
			return;
		}
		res.status(404).json({ 'mensaje': 'Profesor y proyecto no encontrado' })
	}

	public async create(req: Request, res: Response): Promise<void> {
		const resp = await pool.query('INSERT INTO profesorYproyecto SET ?', [req.body])
		res.json(resp)
	}

	public async delete(req: Request, res: Response): Promise<void> {
		const { idProyecto, idProfesor } = req.params
		const resp = await pool.query(`DELETE FROM profesorYproyecto WHERE idProyecto=${idProyecto} AND idProfesor=${idProfesor}`)
		res.json(resp)
	}

	public async update(req: Request, res: Response): Promise<void> {
		const { idProyecto, idProfesor } = req.params
		const resp = await pool.query('UPDATE profesorYproyecto set ? WHERE idProyecto=? AND idProfesor = ?', [req.body, idProyecto, idProfesor])
		res.json(resp)
	}

}

export const profesorYProyectoController = new ProfesorYProyectoController()