import { Request, Response } from 'express'
import pool from '../database'

class ProfesorYMateriaController {

	public async list(req: Request, res: Response): Promise<void> {
		const respuesta = await pool.query('SELECT * FROM profesorYmateria ORDER BY idProfesorYMateria')
		res.json(respuesta)
	}

	public async listOne(req: Request, res: Response): Promise<void> {
		const { idProfesorYMateria } = req.params;
		const respuesta = await pool.query('SELECT * FROM profesorYmateria WHERE idProfesorYMateria = ?', [idProfesorYMateria])
		if (respuesta.length > 0) {
			res.json(respuesta[0])
			return;
		}
		res.status(404).json({ 'mensaje': 'profesorYmateria no encontrado' })
	}

	public async create(req: Request, res: Response): Promise<void> {
		let resp = await pool.query('SELECT idPeriodo FROM periodo WHERE actual=1')
		req.body.idPeriodo = resp[0].idPeriodo
		resp = await pool.query('INSERT INTO profesorYmateria SET ?', [req.body])
		res.json(resp)
	}

	public async delete(req: Request, res: Response): Promise<void> {
		const { idProfesorYMateria } = req.params
		const resp = await pool.query(`DELETE FROM profesorYmateria WHERE idProfesorYMateria=${idProfesorYMateria}`)
		res.json(resp)
	}

	public async update(req: Request, res: Response): Promise<void> {
		const { idProfesorYMateria } = req.params
		const resp = await pool.query('UPDATE profesorYmateria set ? WHERE idProfesorYMateria=?', [req.body, idProfesorYMateria])
		res.json(resp)
	}

}

export const profesorYMateriaController = new ProfesorYMateriaController()