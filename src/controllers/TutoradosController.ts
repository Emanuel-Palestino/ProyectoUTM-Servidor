import { Request, Response } from 'express';
import pool from '../database';

class TutoradoController {

	public async list(req: Request, res: Response): Promise<void> {
		const respuesta = await pool.query('SELECT * FROM tutorado order by idTutorado');
		res.json(respuesta);
	}

	public async listOne(req: Request, res: Response): Promise<void> {
		const { id } = req.params;
		let consulta = 'SELECT * FROM tutorado WHERE idTutorado = ' + id;
		const respuesta = await pool.query(consulta);
		if (respuesta.length > 0) {
			res.json(respuesta[0]);
			return;
		}
		res.status(404).json({ 'mensaje': 'tutorado no encontrado' });
	}

	public async create(req: Request, res: Response): Promise<void> {
		const resp = await pool.query("INSERT INTO tutorado set ?", [req.body]);
		res.json(resp);
	}

	public async delete(req: Request, res: Response): Promise<void> {
		const { id } = req.params
		const resp = await pool.query(`DELETE FROM tutorado WHERE idTutorado = ${id}`);
		res.json(resp);
	}

	public async actualizar(req: Request, res: Response): Promise<void> {
		const { idTutorado } = req.params;
		const resp = await pool.query("UPDATE tutorado set ? WHERE idTutorado= ?", [req.body, idTutorado]);
		res.json(resp);
	}

	public async listTutoradosByPeriodo(req: Request, res: Response): Promise<void> {
		const { idProfesor, fechaIni, fechaFin } = req.params
		let respuesta = await pool.query(`SELECT idProfesor, idTutorado,numero,nivel,idCarrera,estado,inicio,fin,comprobante FROM tutorado WHERE idProfesor='${idProfesor}' AND inicio>='${fechaIni}' AND fin<='${fechaFin}'`)
		res.json(respuesta)

	}

	public async listTutoradosByCareraByPeriodo(req: Request, res: Response): Promise<void> {
		const { idCarrera, fechaIni, fechaFin } = req.params
		let respuesta = await pool.query(`SELECT T.*, P.nombreProfesor FROM tutorado as T INNER JOIN profesores P ON T.idProfesor=P.idProfesor WHERE T.idCarrera='${idCarrera}' AND inicio>='${fechaIni}' AND fin<='${fechaFin}'`)
		res.json(respuesta)

	}

}

export const tutoradoController = new TutoradoController();