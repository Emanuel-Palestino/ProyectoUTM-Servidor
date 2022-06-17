import { Request, Response } from 'express'
import pool from '../database'

class RevisorController {

	public async list(req: Request, res: Response): Promise<void> {
		const respuesta = await pool.query('SELECT * FROM revisor order by idRevisor')
		res.json(respuesta)
	}

	public async listOne(req: Request, res: Response): Promise<void> {
		const { idRevisor } = req.params;
		const respuesta = await pool.query('SELECT * FROM revisor WHERE idRevisor = ?', [idRevisor])
		if (respuesta.length > 0) {
			res.json(respuesta[0])
			return;
		}
		res.status(404).json({ 'mensaje': 'Revisor no encontrado' })
	}

	public async create(req:Request, res: Response): Promise<void> {
		const resp = await pool.query('INSERT INTO revisor SET ?', [req.body])
		res.json(resp)
	}

	public async delete(req:Request, res: Response): Promise<void> {
		const { idRevisor } = req.params
		const resp = await pool.query(`DELETE FROM revisor WHERE idRevisor=${idRevisor}`)
		res.json(resp)
	}

	public async update(req: Request, res: Response): Promise<void> {
		const { idRevisor } = req.params
		const resp = await pool.query('UPDATE revisor set ? WHERE idRevisor=?', [req.body, idRevisor])
		res.json(resp)
	}

	public async listRevisionByProfesor(req: Request, res: Response): Promise<void> {
		const { idProfesor, fechaIni, fechaFin } = req.params
		console.log(idProfesor+" "+fechaIni +" "+ fechaFin);
		const resp = await pool.query(`SELECT tipoRP,nombreRI,fecha,tituloRP,idRevisor FROM revisor WHERE idProfesor = ${idProfesor} AND fecha>= '${fechaIni}' AND fecha<='${fechaFin}'`)
		res.json(resp)
	}
}

export const revisorController = new RevisorController()