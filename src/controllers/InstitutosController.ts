import { Request, Response } from 'express'
import pool from '../database'

class InstitutosController {

	public async list(req: Request, res: Response): Promise<void> {
		const respuesta = await pool.query('SELECT * FROM institutos order by codigoInstituto')
		res.json(respuesta)
	}

	public async listOne(req: Request, res: Response): Promise<void> {
		const { idInstituto } = req.params;
		const respuesta = await pool.query('SELECT * FROM institutos WHERE idInstituto = ?', [idInstituto])
		if (respuesta.length > 0) {
			res.json(respuesta[0])
			return;
		}
		res.status(404).json({ 'mensaje': 'Instituto no encontrado' })
	}

	public async create(req: Request, res: Response): Promise<void> {
		const resp = await pool.query('INSERT INTO institutos SET ?', [req.body])
		res.json(resp)
	}

	public async delete(req: Request, res: Response): Promise<void> {
		const { idInstituto } = req.params
		const resp = await pool.query(`DELETE FROM institutos WHERE idInstituto=${idInstituto}`)
		res.json(resp)
	}

	public async update(req: Request, res: Response): Promise<void> {
		const { idInstituto } = req.params
		const resp = await pool.query('UPDATE institutos set ? WHERE idInstituto=?', [req.body, idInstituto])
		res.json(resp)
	}

}

export const institutosController = new InstitutosController()