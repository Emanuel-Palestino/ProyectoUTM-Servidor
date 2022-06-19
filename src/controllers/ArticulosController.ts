import { Request, Response } from 'express';
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
		const { idProfesor, fecha } = req.params
		const resp = await pool.query('INSERT INTO articulos SET ?', [req.body])
		let dato = {
			idProfesor: idProfesor,
			idArticulo: resp.insertId,
			pos: 1,
			validado: 1,
			fechaModificacion: fecha,
			esInterno: 1
		}
		const resp2 = await pool.query('INSERT INTO profesorYArticulo SET ?', dato)
		res.json(resp2)
	}

	public async delete(req:Request, res: Response): Promise<void> {
		const { idArticulo } = req.params
		let resp = await pool.query(`DELETE FROM articulos WHERE idArticulo=${idArticulo}`)
		resp = await pool.query(`DELETE FROM profesorYArticulo WHERE idArticulo=${idArticulo}`)
		res.json(resp)
	}

	public async update(req: Request, res: Response): Promise<void> {
		const { idArticulo } = req.params
		const resp = await pool.query('UPDATE articulos set ? WHERE idArticulo=?', [req.body, idArticulo])
		res.json(resp)
	}

	public async listArticulosByProfesorByPeriodo(req: Request, res: Response): Promise<void> {
		const { idProfesor, fechaIni, fechaFin } = req.params
		let respuesta = await pool.query(`SELECT A.idArticulo, A.titulo, A.tipoCRL, A.estado, A.anyo FROM articulos as A INNER JOIN profesorYArticulo PA ON PA.idArticulo=A.idArticulo WHERE PA.idProfesor=${idProfesor} AND fechaedicion >= '${fechaIni}' AND fechaedicion <= '${fechaFin}'`)
		
		// Obtener los profesores participantes
		for (let i = 0; i < respuesta.length; i++) {
			//Sacamos los profesores del articulo
			const respuesta2 = await pool.query('SELECT P.*, PA.fechaModificacion FROM profesores as P INNER JOIN profesorYArticulo PA ON PA.idProfesor=P.idProfesor WHERE PA.idArticulo = ? ORDER BY PA.pos', [respuesta[i].idArticulo])
			respuesta[i].autores = respuesta2
		}

		res.json(respuesta)
	}

	public async getArticulosByInstituto(req: Request, res: Response): Promise<void> {
		const { idInstituto } = req.params
		let respuesta = await pool.query(`SELECT A.* FROM articulos as A INNER JOIN profesorYArticulo PA ON PA.idArticulo=A.idArticulo INNER JOIN profesores P ON P.idProfesor=PA.idProfesor WHERE P.idInstituto=${idInstituto}`)
		// Obtener los profesores participantes y archivos subidos
		for (let i = 0; i < respuesta.length; i++) {
			const respuesta2 = await pool.query('SELECT P.idProfesor, P.nombreProfesor, P.nombreApa, PA.pos FROM profesores as P INNER JOIN profesorYArticulo PA ON PA.idProfesor=P.idProfesor WHERE PA.idArticulo=? ORDER BY PA.pos', respuesta[i].idArticulo)
			respuesta[i].autores = respuesta2
		}

		res.json(respuesta)
	}

	public async getArticulosByInstitutoByFecha(req: Request, res: Response): Promise<void> {
		const { idInstituto, fechaIni, fechaFin } = req.params
		let respuesta = await pool.query(`SELECT A.* FROM articulos as A INNER JOIN profesorYArticulo PA ON PA.idArticulo=A.idArticulo INNER JOIN profesores P ON P.idProfesor=PA.idProfesor WHERE P.idInstituto=${idInstituto} AND fechaedicion >= '${fechaIni}' AND fechaedicion <= '${fechaFin}'`)
		
		// Obtener los profesores participantes
		for (let i = 0; i < respuesta.length; i++) {
			const respuesta2 = await pool.query('SELECT P.idProfesor, P.nombreProfesor, P.nombreApa, PA.pos FROM profesores as P INNER JOIN profesorYArticulo PA ON PA.idProfesor=P.idProfesor WHERE PA.idArticulo=? ORDER BY PA.pos', respuesta[i].idArticulo)
			respuesta[i].autores = respuesta2
		}

		res.json(respuesta)
	}


	public async getTodoPorInsituto(req: Request, res: Response): Promise<void> {
		const { idInstituto, fechaIni, fechaFin } = req.params
		let respuesta = await pool.query(`SELECT A.* FROM articulos as A INNER JOIN profesorYArticulo PA ON PA.idArticulo=A.idArticulo INNER JOIN profesores P ON P.idProfesor=PA.idProfesor WHERE PA.pos=1 AND P.idInstituto=${idInstituto} AND fechaedicion >= '${fechaIni}' AND fechaedicion <= '${fechaFin}'`)
		// Obtener los profesores participantes
		for (let i = 0; i < respuesta.length; i++) {
			const respuesta2 = await pool.query('SELECT P.idProfesor, P.nombreProfesor, P.nombreApa, PA.pos FROM profesores as P INNER JOIN profesorYArticulo PA ON PA.idProfesor=P.idProfesor WHERE PA.idArticulo=? ORDER BY PA.pos', respuesta[i].idArticulo)
			respuesta[i].autores = respuesta2
		}

		res.json(respuesta)
	}
	
	public async getTodoDivididoInstituto(req: Request, res: Response): Promise<void> {
		let respuesta = await pool.query(`SELECT A.*, I.nombreInstituto FROM articulos as A INNER JOIN profesorYArticulo PA ON PA.idArticulo=A.idArticulo INNER JOIN profesores P ON P.idProfesor=PA.idProfesor AND PA.pos=1 INNER JOIN institutos I ON P.idInstituto=I.idInstituto WHERE I.idInstituto > 0 ORDER BY I.idInstituto;`)
		// Obtener los profesores participantes
		for (let i = 0; i < respuesta.length; i++) {
			const respuesta2 = await pool.query('SELECT P.idProfesor, P.nombreProfesor, P.nombreApa, PA.pos FROM profesores as P INNER JOIN profesorYArticulo PA ON PA.idProfesor=P.idProfesor WHERE PA.idArticulo=? ORDER BY PA.pos', respuesta[i].idArticulo)
			respuesta[i].autores = respuesta2
		}

		res.json(respuesta)
	}

	public async getTodoDivididoInstitutoPorFecha(req: Request, res: Response): Promise<void> {
		const { fechaIni, fechaFin } = req.params
		let respuesta = await pool.query(`SELECT A.*, I.nombreInstituto FROM articulos as A INNER JOIN profesorYArticulo PA ON PA.idArticulo=A.idArticulo INNER JOIN profesores P ON P.idProfesor=PA.idProfesor AND PA.pos=1 INNER JOIN institutos I ON P.idInstituto=I.idInstituto WHERE I.idInstituto > 0 AND A.fechaedicion>='${fechaIni}' AND A.fechaedicion<='${fechaFin}' ORDER BY I.idInstituto;`)
		// Obtener los profesores participantes
		for (let i = 0; i < respuesta.length; i++) {
			const respuesta2 = await pool.query('SELECT P.idProfesor, P.nombreProfesor, P.nombreApa, PA.pos FROM profesores as P INNER JOIN profesorYArticulo PA ON PA.idProfesor=P.idProfesor WHERE PA.idArticulo=? ORDER BY PA.pos', respuesta[i].idArticulo)
			respuesta[i].autores = respuesta2
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

	public async getSugerenciasExternoByAutorUTM(req:Request, res: Response): Promise<void>{
		const {idProfesor} = req.params;
		let listexternos = await pool.query(`SELECT DISTINCT EA.* FROM externosAPA AS EA INNER JOIN profesorYArticulo PAE ON EA.idExternoAPA = PAE.idProfesor INNER JOIN profesorYArticulo PAO ON PAE.idArticulo = PAO.idArticulo WHERE PAE.esInterno = 0 AND PAO.esInterno!=0 AND PAO.idProfesor = ${idProfesor}`);
		res.json(listexternos);
	}

}

export const articulosController = new ArticulosController()