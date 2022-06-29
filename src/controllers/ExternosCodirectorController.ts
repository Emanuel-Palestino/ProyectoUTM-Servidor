import { Request, Response } from 'express';
import pool from '../database';

class ExternosCodirectorController {

	public async list(req: Request, res: Response): Promise<void> {
		const respuesta = await pool.query('SELECT * FROM externoCodirector order by idExternoCodirector');
		res.json(respuesta);
	}

	public async listOne(req: Request, res: Response): Promise<void> {
		const { idExternoCodirector } = req.params;
		let consulta = 'SELECT * FROM externoCodirector WHERE idExternoCodirector = ' + idExternoCodirector;
		const respuesta = await pool.query(consulta);
		if (respuesta.length > 0) {
			res.json(respuesta[0]);
			return;
		}
		res.status(404).json({ 'mensaje': 'Externo no encontrado' });
	}

	public async create(req: Request, res: Response): Promise<void> {
		const resp = await pool.query("INSERT INTO externoCodirector set ?", [req.body]);
		res.json(resp);
	}

	public async delete(req: Request, res: Response): Promise<void> {
		const { idExternoCodirector } = req.params
		const resp = await pool.query(`DELETE FROM externoCodirector WHERE idExternoCodirector = ${idExternoCodirector}`);
		res.json(resp);
	}

	public async actualizar(req: Request, res: Response): Promise<void> {
		const { idExternoCodirector } = req.params;
		const resp = await pool.query("UPDATE externoCodirector set ? WHERE idExternoCodirector = ?", [req.body, idExternoCodirector]);
		res.json(resp);
	}

}

export const externosCodirectorController = new ExternosCodirectorController();