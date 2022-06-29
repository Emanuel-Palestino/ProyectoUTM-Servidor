import { Request, Response } from 'express'
import pool from '../database'

class ProfesorYComisionController {

	public async list(req: Request, res: Response): Promise<void> {
		const respuesta = await pool.query('SELECT * FROM profesorYcomision order by pos')
		res.json(respuesta)
	}

	public async listOne(req: Request, res: Response): Promise<void> {
		const { idProfesor, idComision } = req.params;
		const respuesta = await pool.query('SELECT * FROM profesorYcomision WHERE idProfesor = ? AND idComision = ?', [idProfesor, idComision]);
		if (respuesta.length > 0) {
			res.json(respuesta[0])
			return;
		}
		res.status(404).json({ 'mensaje': 'Fila no encontrada' })
	}

	public async create(req: Request, res: Response): Promise<void> {
		const resp = await pool.query('INSERT INTO profesorYcomision SET ?', [req.body])
		res.json(resp)
	}

	public async delete(req: Request, res: Response): Promise<void> {
		const { idProfesor, idComision } = req.params;
		const resp = await pool.query(`DELETE FROM profesorYcomision WHERE idProfesor = ${idProfesor} AND idComision = ${idComision}`)
		res.json(resp)
	}

	public async update(req: Request, res: Response): Promise<void> {
		const { idProfesor, idComision } = req.params;
		const resp = await pool.query('UPDATE profesorYcomision set ? WHERE idProfesor = ? AND idComision = ?', [req.body, idProfesor, idComision])
		res.json(resp)
	}

	public async addComisionado(req: Request, res: Response): Promise<void> {
		let { idComision } = req.params;
		let respT: any = [];
		for (let i = 0; i < req.body.length; i++) {
			let dato = {
				idComision: idComision,
				idProfesor: req.body[i].idProfesor,
				pos: req.body[i].pos,
				final: req.body[i].final,
				comprobante: ' '
			}
			const resp = await pool.query('INSERT INTO profesorYcomision SET ?', dato)
			respT.push(resp)
		}
		res.json(respT)
	}

}

export const profesorYComisionController = new ProfesorYComisionController();