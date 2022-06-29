import { Request, Response } from 'express';
import pool from '../database';

class ProfesorYPatenteController {

	public async list(req: Request, res: Response): Promise<void> {
		const respuesta = await pool.query('SELECT * FROM profesorYpatente order by idPatente');
		res.json(respuesta);
	}

	public async listOne(req: Request, res: Response): Promise<void> {
		const { idProfesor, idPatente, esInterno } = req.params;
		const respuesta = await pool.query(`SELECT * FROM profesorYpatente WHERE idProfesor=${idProfesor} AND idPatente =${idPatente} AND esInterno=${esInterno}`);
		if (respuesta.length > 0) {
			res.json(respuesta[0]);
			return;
		}
		res.status(404).json({ 'mensaje': 'Patente no encontrada' });
	}

	public async create(req: Request, res: Response): Promise<void> {
		const resp = await pool.query("INSERT INTO profesorYpatente set ?", [req.body]);
		res.json(resp);
	}

	public async delete(req: Request, res: Response): Promise<void> {
		const { idProfesor, idPatente, esInterno } = req.params;
		const resp = await pool.query(`DELETE FROM profesorYpatente WHERE idProfesor=${idProfesor} AND idPatente =${idPatente} AND esInterno=${esInterno}`);
		res.json(resp);
	}

	public async actualizar(req: Request, res: Response): Promise<void> {
		const { idProfesor, idPatente, esInterno } = req.params;
		const resp = await pool.query(`UPDATE profesorYpatente set ? WHERE idProfesor=${idProfesor} AND idPatente =${idPatente} AND esInterno=${esInterno}`, req.body);
		res.json(resp);
	}

}

export const profesorYPatenteController = new ProfesorYPatenteController();