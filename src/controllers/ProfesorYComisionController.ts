import { Request, Response } from 'express'
import pool from '../database'

class ProfesorYComisionController{
    public async list(req: Request, res: Response): Promise<void> {
		const respuesta = await pool.query('SELECT * FROM profesorycomision order by pos')
		res.json(respuesta)
	}

	public async listOne(req: Request, res: Response): Promise<void> {
		const { idProfesor, idComision} = req.params;
		const respuesta = await pool.query('SELECT * FROM profesorycomision WHERE idProfesor = ? AND idComision = ?', [idProfesor,idComision]);
		if (respuesta.length > 0) {
			res.json(respuesta[0])
			return;
		}
		res.status(404).json({ 'mensaje': 'Fila no encontrada' })
	}

	public async create(req:Request, res: Response): Promise<void> {
		const resp = await pool.query('INSERT INTO profesorycomision SET ?', [req.body])
		res.json(resp)
	}

	public async delete(req:Request, res: Response): Promise<void> {
        const { idProfesor, idComision} = req.params;
		const resp = await pool.query(`DELETE FROM profesorycomision WHERE idProfesor = ${idProfesor} AND idComision = ${idComision}`)
		res.json(resp)
	}

	public async update(req: Request, res: Response): Promise<void> {
		const { idProfesor, idComision} = req.params;
		const resp = await pool.query('UPDATE profesorycomision set ? WHERE idProfesor = ? AND idComision = ?', [req.body,idProfesor, idComision])
		res.json(resp)
	}
}

export const profesorYComisionController = new ProfesorYComisionController();