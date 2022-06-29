import { Request, Response } from 'express'
import pool from '../database'

class CarrerasController {

	public async create(req: Request, res: Response): Promise<void> {
		const resp = await pool.query('INSERT INTO carreras SET ?', [req.body])
		res.json(resp)
	}

	public async list(req: Request, res: Response): Promise<void> {
		const respuesta = await pool.query('SELECT * FROM carreras order by codigoCarrera')
		res.json(respuesta)
	}

	public async listOne(req: Request, res: Response): Promise<void> {
		const { idCarrera } = req.params;
		const respuesta = await pool.query('SELECT * FROM carreras WHERE idCarrera = ?', [idCarrera])
		if (respuesta.length > 0) {
			res.json(respuesta[0])
			return;
		}
		res.status(404).json({ 'mensaje': 'Carrera no encontrada' })
	}

	public async update(req: Request, res: Response): Promise<void> {
		const { idCarrera } = req.params
		const resp = await pool.query('UPDATE carreras set ? WHERE idCarrera=?', [req.body, idCarrera])
		res.json(resp)
	}

	public async delete(req: Request, res: Response): Promise<void> {
		const { idCarrera } = req.params
		const resp = await pool.query(`DELETE FROM carreras WHERE idCarrera=${idCarrera}`)
		res.json(resp)
	}

	public async getCarrerasByInstituto(req: Request, res: Response): Promise<void> {
		const { idInstituto } = req.params;
		const resp = await pool.query(`SELECT * FROM carreras WHERE idInstituto= ${idInstituto}`);
		res.json(resp);
	}

}

export const carrerasController = new CarrerasController()