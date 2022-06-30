import { Request, Response } from 'express'
import pool from '../database'

class GruposMultiplesController {

	public async list(req: Request, res: Response): Promise<void> {
		const respuesta = await pool.query('SELECT * FROM gruposMultiples order by idProfesorYMateriaMultiple')
		res.json(respuesta)
	}

	public async create(req: Request, res: Response): Promise<void> {
		const resp = await pool.query('INSERT INTO gruposMultiples SET ?', [req.body])
		res.json(resp)
	}

	public async delete(req: Request, res: Response): Promise<void> {
		const { idProfesorYMateriaMultiple } = req.params
		const { idPlan, semestre, grupo } = req.body
		const resp = await pool.query(`DELETE FROM gruposMultiples WHERE idProfesorYMateriaMultiple=${idProfesorYMateriaMultiple} AND idPlan=${idPlan} AND semestre=${semestre} AND grupo=${grupo}`)
		res.json(resp)
	}

}

export const gruposMultiplesController = new GruposMultiplesController()