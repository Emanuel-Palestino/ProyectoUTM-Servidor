import { Request, Response } from 'express'
import pool from '../database'

class ArticulosController {

	public async list(req: Request, res: Response): Promise<void> {
		const respuesta = await pool.query('SELECT * FROM articulos order by idArticulo')
		res.json(respuesta)
	}

	public async listOne(req: Request, res: Response): Promise<void> {
		const { id } = req.params;
		const respuesta = await pool.query('SELECT * FROM articulos WHERE idArticulo = ?', [id])
		if (respuesta.length > 0) {
			res.json(respuesta[0])
			return;
		}
		res.status(404).json({ 'mensaje': 'Articulo no encontrado' })
	}

	public async create(req:Request, res: Response): Promise<void> {
		const { idProfesor } = req.params
		const resp = await pool.query('INSERT INTO articulos SET ?', [req.body])
		let dato = {
			idProfesor: idProfesor,
			idArticulo: resp.insertId,
			posicion: 1
		}
		const resp2 = await pool.query('INSERT INTO profesorYArticulo SET ?', dato)
		res.json(resp2)
	}

	public async delete(req:Request, res: Response): Promise<void> {
		const { idArticulo } = req.params
		const resp = await pool.query(`DELETE FROM articulos WHERE idArticulo=${idArticulo}`)
		res.json(resp)
	}

	public async update(req: Request, res: Response): Promise<void> {
		const { idArticulo } = req.params
		const resp = await pool.query('UPDATE articulos set ? WHERE idArticulo=?', [req.body, idArticulo])
		res.json(resp)
	}

	public async getArticulosByProfesor(req: Request, res: Response): Promise<void> {
		const { idProfesor, fechaIni, fechaFin } = req.params
		let respuesta = await pool.query(`SELECT A.* FROM articulos as A INNER JOIN profesorYArticulo AP ON AP.idArticulo=A.idArticulo WHERE AP.idProfesor=${idProfesor} AND fechaedicion >= '${fechaIni}' AND fechaedicion <= '${fechaFin}'`)
		// Obtener los profesores participantes
		for (let i = 0; i < respuesta.length; i++) {
			const respuesta2 = await pool.query('SELECT P.* FROM profesores as P INNER JOIN profesorYArticulo AP ON AP.idProfesor=P.idProfesor WHERE AP.idArticulo=? ORDER BY AP.pos', respuesta[i].idArticulo)
			respuesta[i].profesores = respuesta2
			const respuesta3 = await pool.query('SELECT * FROM archivoyarticulo WHERE idArticulo=?', respuesta[i].idArticulo)
			respuesta[i].archivos = respuesta3
		}

		res.json(respuesta)
	}

	public async getArticulosByInstituto(req: Request, res: Response): Promise<void> {
		const { idInstituto } = req.params
		let respuesta = await pool.query(`SELECT A.* FROM articulos as A INNER JOIN profesorYArticulo AP ON AP.idArticulo=A.idArticulo INNER JOIN profesores P ON P.idProfesor=AP.idProfesor WHERE P.idInstituto=${idInstituto}`)
		// Obtener los profesores participantes y archivos subidos
		for (let i = 0; i < respuesta.length; i++) {
			const respuesta2 = await pool.query('SELECT P.* FROM profesores as P INNER JOIN profesorYArticulo AP ON AP.idProfesor=P.idProfesor WHERE AP.idArticulo=? ORDER BY AP.pos', respuesta[i].idArticulo)
			respuesta[i].profesores = respuesta2
		}

		res.json(respuesta)
	}

	public async getArticulosByInstitutoByFecha(req: Request, res: Response): Promise<void> {
		const { idInstituto, fechaIni, fechaFin } = req.params
		let respuesta = await pool.query(`SELECT A.* FROM articulos as A INNER JOIN profesorYArticulo AP ON AP.idArticulo=A.idArticulo INNER JOIN profesores P ON P.idProfesor=AP.idProfesor WHERE P.idInstituto=${idInstituto} AND fechaedicion >= '${fechaIni}' AND fechaedicion <= '${fechaFin}'`)
		// Obtener los profesores participantes
		for (let i = 0; i < respuesta.length; i++) {
			const respuesta2 = await pool.query('SELECT P.* FROM profesores as P INNER JOIN profesorYArticulo AP ON AP.idProfesor=P.idProfesor WHERE AP.idArticulo=? ORDER BY AP.pos', respuesta[i].idArticulo)
			respuesta[i].profesores = respuesta2
		}

		res.json(respuesta)
	}

	public async getTodoPorInsituto(req: Request, res: Response): Promise<void> {
		const { idInstituto, fechaIni, fechaFin } = req.params
		let respuesta = await pool.query(`SELECT A.* FROM articulos as A INNER JOIN profesorYArticulo AP ON AP.idArticulo=A.idArticulo INNER JOIN profesores P ON P.idProfesor=AP.idProfesor WHERE AP.pos=1 AND P.idInstituto=${idInstituto} AND fechaedicion >= '${fechaIni}' AND fechaedicion <= '${fechaFin}'`)
		// Obtener los profesores participantes
		for (let i = 0; i < respuesta.length; i++) {
			const respuesta2 = await pool.query('SELECT P.* FROM profesores as P INNER JOIN profesorYArticulo AP ON AP.idProfesor=P.idProfesor WHERE AP.idArticulo=? ORDER BY AP.pos', respuesta[i].idArticulo)
			respuesta[i].profesores = respuesta2
		}

		res.json(respuesta)
	}
	
	public async getTodoDivididoInstituto(req: Request, res: Response): Promise<void> {
		let respuesta = await pool.query(`SELECT A.*, I.nombreInstituto FROM articulos as A INNER JOIN profesorYArticulo AP ON AP.idArticulo=A.idArticulo INNER JOIN profesores P ON P.idProfesor=AP.idProfesor AND AP.pos=1 INNER JOIN institutos I ON P.idInstituto=I.idInstituto WHERE I.idInstituto > 0 ORDER BY I.idInstituto;`)
		// Obtener los profesores participantes
		for (let i = 0; i < respuesta.length; i++) {
			const respuesta2 = await pool.query('SELECT P.* FROM profesores as P INNER JOIN profesorYArticulo AP ON AP.idProfesor=P.idProfesor WHERE AP.idArticulo=? ORDER BY AP.pos', respuesta[i].idArticulo)
			respuesta[i].profesores = respuesta2
		}

		res.json(respuesta)
	}

	public async getTodoDivididoInstitutoPorFecha(req: Request, res: Response): Promise<void> {
		const { fechaIni, fechaFin } = req.params
		let respuesta = await pool.query(`SELECT A.*, I.nombreInstituto FROM articulos as A INNER JOIN profesorYArticulo AP ON AP.idArticulo=A.idArticulo INNER JOIN profesores P ON P.idProfesor=AP.idProfesor AND AP.pos=1 INNER JOIN institutos I ON P.idInstituto=I.idInstituto WHERE I.idInstituto > 0 AND A.fechaedicion>='${fechaIni}' AND A.fechaedicion<='${fechaFin}' ORDER BY I.idInstituto;`)
		// Obtener los profesores participantes
		for (let i = 0; i < respuesta.length; i++) {
			const respuesta2 = await pool.query('SELECT P.* FROM profesores as P INNER JOIN profesorYArticulo AP ON AP.idProfesor=P.idProfesor WHERE AP.idArticulo=? ORDER BY AP.pos', respuesta[i].idArticulo)
			respuesta[i].profesores = respuesta2
		}

		res.json(respuesta)
	
	}

	public async listByPeriodo(req: Request, res: Response): Promise<void> {
		const { fechaIni, fechaFin } = req.params;
		const respuesta = await pool.query(`SELECT * FROM articulos WHERE fechaedicion >= "${fechaIni}" AND fechaedicion <= "${fechaFin}"`)
		if (respuesta.length > 0) {
			console.log(respuesta.length)
			res.json(respuesta)
			return;
		}
		res.json({ 'mensaje': 'Articulos no encontrados' })
	}

}

export const articulosController = new ArticulosController()