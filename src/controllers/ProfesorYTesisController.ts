import { Request, Response } from 'express'
import pool from '../database'

class ProfesorYTesisController {
	public async list(req: Request, res: Response): Promise<void> {
		const respuesta = await pool.query('SELECT * FROM profesorYtesis order by idTesis');
		res.json(respuesta);
	}
	public async listOne(req: Request, res: Response): Promise<void> {
		const { idTesis, idProfesor } = req.params;
		const respuesta = await pool.query(`SELECT * FROM profesorYtesis WHERE idTesis =${idTesis} AND idProfesor=${idProfesor}`);
		if (respuesta.length > 0) {
			res.json(respuesta[0]);
			return;
		}
		res.status(404).json({ 'mensaje': 'profesorYTesis no encontrado' });
	}
	public async create(req: Request, res: Response): Promise<void> {
		const resp = await pool.query("INSERT INTO profesorYtesis set ?", [req.body]);
		res.json(resp);
	}

	public async delete(req: Request, res: Response): Promise<void> {
		const { idTesis, idProfesor } = req.params
		const resp = await pool.query(`DELETE FROM profesorYtesis WHERE idTesis = ${idTesis} AND idProfesor = ${idProfesor}`);
		res.json(resp);
	}
	public async update(req: Request, res: Response): Promise<void> {
		const { idTesis, idProfesor } = req.params;
		const resp = await pool.query(`UPDATE profesorYtesis set ? WHERE idTesis = ${idTesis} AND idProfesor = ${idProfesor}`, [req.body, idTesis, idProfesor]);
		res.json(resp);
	}
}

export const profesorYTesisController = new ProfesorYTesisController()