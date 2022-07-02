import { Request, Response } from 'express'
import pool from '../database'

class EventosController {

	public async list(req: Request, res: Response): Promise<void> {
		const respuesta = await pool.query('SELECT * FROM eventos order by idEvento')
		res.json(respuesta)
	}

	public async listOne(req: Request, res: Response): Promise<void> {
		const { id } = req.params;
		const respuesta = await pool.query('SELECT * FROM eventos WHERE idEvento = ?', [id])
		if (respuesta.length > 0) {
			res.json(respuesta[0])
			return;
		}
		res.status(404).json({ 'mensaje': 'Evento no encontrado' })
	}

	public async create(req: Request, res: Response): Promise<void> {
		const resp = await pool.query('INSERT INTO eventos SET ?', [req.body])
		res.json(resp)
	}

	public async delete(req: Request, res: Response): Promise<void> {
		const { idEvento } = req.params
		const resp = await pool.query(`DELETE FROM eventos WHERE idEvento=${idEvento}`)
		res.json(resp)
	}

	public async update(req: Request, res: Response): Promise<void> {
		const { idEvento } = req.params
		const resp = await pool.query('UPDATE eventos set ? WHERE idEvento=?', [req.body, idEvento])
		res.json(resp)
	}

	public async getEventosByProfesor(req: Request, res: Response): Promise<void> {
		const { idProfesor, fechaIni, fechaFin } = req.params
		let respuesta = await pool.query(`SELECT E.*, P.nombreProfesor, P.idProfesor FROM eventos as E INNER JOIN profesores P ON P.idProfesor=E.idProfesor WHERE P.idProfesor=${idProfesor} AND inicio>='${fechaIni}' AND fin<='${fechaFin}'`)
		res.json(respuesta)
	}

	public async getEventosByInstituto(req: Request, res: Response): Promise<void> {
		const { idInstituto, fechaIni, fechaFin } = req.params
		let respuesta = await pool.query(`SELECT E.*, P.nombreProfesor FROM eventos as E INNER JOIN profesores P ON P.idProfesor=E.idProfesor WHERE P.idInstituto=${idInstituto} AND E.inicio>='${fechaIni}' AND E.fin<='${fechaFin}'`)
		res.json(respuesta)
	}

	public async getEventosByCarrera(req: Request, res: Response): Promise<void> {
		const { idCarrera, fechaIni, fechaFin } = req.params
		let respuesta = await pool.query(`SELECT E.*, P.nombreProfesor FROM eventos as E INNER JOIN profesores P ON P.idProfesor=E.idProfesor WHERE P.idCarrera=${idCarrera} AND E.inicio>='${fechaIni}' AND E.fin<='${fechaFin}'`)
		res.json(respuesta)
	}
	public async listEventosByPeriodo(req: Request, res: Response): Promise<void> {
		const { idProfesor, fechaIni, fechaFin } = req.params
		let respuesta = await pool.query(`SELECT idEvento, nombreEvento,titulo, tipoEvento, participacion, afectaLinea, tipoParticipacion, inicio, fin, comprobante FROM eventos WHERE idProfesor='${idProfesor}' AND inicio>='${fechaIni}' and fin<='${fechaFin}'`)
		res.json(respuesta)
	}

}

export const eventosController = new EventosController()