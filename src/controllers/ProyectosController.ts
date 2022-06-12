import { Request, Response } from 'express'
import pool from '../database'

class ProyectosController {

	public async list(req: Request, res: Response): Promise<void> {
		const respuesta = await pool.query('SELECT * FROM proyectos')
		res.json(respuesta)
	}

	public async listOne(req: Request, res: Response): Promise<void> {
		const { idProyecto } = req.params;
		const respuesta = await pool.query('SELECT * FROM proyectos WHERE idProyecto = ?', [idProyecto])
		if (respuesta.length > 0) {
			res.json(respuesta[0])
			return;
		}
		res.status(404).json({ 'mensaje': 'Proyecto no encontrado' })
	}

	public async create(req:Request, res: Response): Promise<void> {
		const resp = await pool.query('INSERT INTO proyectos SET ?', [req.body])
		res.json(resp)
	}

	public async delete(req:Request, res: Response): Promise<void> {
		const { idProyecto } = req.params
		const resp = await pool.query(`DELETE FROM proyectos WHERE idProyecto=${idProyecto}`)
		res.json(resp)
	}

	public async update(req: Request, res: Response): Promise<void> {
		const { idProyecto } = req.params
		const resp = await pool.query('UPDATE proyectos set ? WHERE idProyecto=?', [req.body, idProyecto])
		res.json(resp)
	}

}

export const proyectosController = new ProyectosController()