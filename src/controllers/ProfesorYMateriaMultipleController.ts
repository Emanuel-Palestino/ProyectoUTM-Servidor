import { Request, Response } from 'express'
import pool from '../database'

class ProfesorYMateriaMultipleController {

	public async list(req: Request, res: Response): Promise<void> {
		const respuesta = await pool.query('SELECT * FROM profesorYmateriaMultiple ORDER BY idProfesorYMateriaMultiple')
		res.json(respuesta)
	}

	public async listOne(req: Request, res: Response): Promise<void> {
		const { idProfesorYMateriaMultiple } = req.params;
		const respuesta = await pool.query('SELECT * FROM profesorYmateriaMultiple WHERE idProfesorYMateriaMultiple = ?', [idProfesorYMateriaMultiple])
		if (respuesta.length > 0) {
			res.json(respuesta[0])
			return;
		}
		res.status(404).json({ 'mensaje': 'profesorYmateriaMultiple no encontrado' })
	}

	public async create(req: Request, res: Response): Promise<void> {
		const resp = await pool.query('INSERT INTO profesorYmateriaMultiple SET ?', [req.body])
		res.json(resp)
	}

	public async delete(req: Request, res: Response): Promise<void> {
		const { idProfesorYMateriaMultiple } = req.params
		let resp = await pool.query(`DELETE FROM gruposMultiples WHERE idProfesorYMateriaMultiple=${idProfesorYMateriaMultiple}`)
		resp = await pool.query(`DELETE FROM profesorYmateriaMultiple WHERE idProfesorYMateriaMultiple=${idProfesorYMateriaMultiple}`)
		res.json(resp)
	}

	public async update(req: Request, res: Response): Promise<void> {
		const { idProfesorYMateriaMultiple } = req.params
		const resp = await pool.query('UPDATE profesorYmateriaMultiple set ? WHERE idProfesorYMateriaMultiple=?', [req.body, idProfesorYMateriaMultiple])
		res.json(resp)
	}

}

export const profesorYMateriaMultipleController = new ProfesorYMateriaMultipleController()