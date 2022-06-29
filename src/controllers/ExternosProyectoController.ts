import { Request, Response } from 'express'
import pool from '../database'

class ExternosProyectoController {

	public async list(req: Request, res: Response): Promise<void> {
		const respuesta = await pool.query('SELECT * FROM externosProyecto')
		res.json(respuesta)
	}

	public async listOne(req: Request, res: Response): Promise<void> {
		const { idExterno } = req.params;
		const respuesta = await pool.query('SELECT * FROM externosProyecto WHERE idExternoProyecto = ? ', [idExterno])
		if (respuesta.length > 0) {
			res.json(respuesta[0])
			return;
		}
		res.status(404).json({ 'mensaje': 'Externo no encontrado' })
	}

	public async create(req: Request, res: Response): Promise<void> {
		const resp = await pool.query('INSERT INTO externosProyecto SET ?', [req.body])
		res.json(resp)
	}

	public async delete(req: Request, res: Response): Promise<void> {
		const { idExterno } = req.params
		const resp = await pool.query(`DELETE FROM externosProyecto WHERE idExternoProyecto=${idExterno}`)
		res.json(resp)
	}

	public async update(req: Request, res: Response): Promise<void> {
		const { idExterno } = req.params
		const resp = await pool.query('UPDATE externosProyecto set ? WHERE idExternoProyecto=? ', [req.body, idExterno])
		res.json(resp)
	}

}

export const externosProyectoController = new ExternosProyectoController()