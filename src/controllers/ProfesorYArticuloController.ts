import { Request, Response } from 'express'
import pool from '../database'

class ProfesorYArticuloController {

	public async list(req: Request, res: Response): Promise<void> {
		const respuesta = await pool.query('SELECT * FROM profesorYarticulo order by idArticuloYProfesor')
		res.json(respuesta)
	}

	public async listOne(req: Request, res: Response): Promise<void> {
		const { id } = req.params;
		const respuesta = await pool.query('SELECT * FROM profesorYarticulo WHERE idArticuloYProfesor = ?', [id])
		if (respuesta.length > 0) {
			res.json(respuesta[0])
			return;
		}
		res.status(404).json({ 'mensaje': 'Fila no encontrada' })
	}

	public async create(req: Request, res: Response): Promise<void> {
		const resp = await pool.query('INSERT INTO profesorYarticulo SET ?', [req.body])
		res.json(resp)
	}

	public async delete(req: Request, res: Response): Promise<void> {
		const { idArticulo, idProfesor, esInterno } = req.params
		const resp = await pool.query(`DELETE FROM profesorYarticulo WHERE idArticulo=${idArticulo} AND idProfesor=${idProfesor} AND esInterno=${esInterno}`)
		res.json(resp)
	}

	public async update(req: Request, res: Response): Promise<void> {
		const { idArticuloYProfesor } = req.params
		const resp = await pool.query('UPDATE profesorYarticulo set ? WHERE idArticuloYProfesor=?', [req.body, idArticuloYProfesor])
		res.json(resp)
	}

	public async updatePrioridadesOfAutoresByPublicacion(req: Request, res: Response): Promise<void> {
		let resp
		const { idArticulo } = req.params
		let hoy: Date = new Date()
		let fecha = hoy.getFullYear() + '-' + ('0' + (hoy.getMonth() + 1)).slice(-2) + '-' + ('0' + hoy.getDate()).slice(-2)
		for (let i = 0; i < req.body.length; i++) {
			const utm = req.body[i]
			utm.fechaModificacion = fecha
			resp = await pool.query('UPDATE profesorYarticulo set ? WHERE idArticulo = ? AND idProfesor = ? AND esInterno = ?', [utm, idArticulo, utm.idProfesor, utm.esInterno])
		}
		res.json(resp)
	}

	public async profesoresByArticulo(req: Request, res: Response): Promise<void> {
		const { idArticulo } = req.params;
		const respuesta = await pool.query(`SELECT nombres FROM profesores, articulos, profesorYarticulo 
		WHERE articulos.idArticulo=${idArticulo} AND articuloyprofesor.idArticulo = articulos.idArticulo 
		AND articuloyprofesor.idProfesor = profesores.idProfesor;`)
		if (respuesta.length > 0) {
			res.json(respuesta)
			return;
		}
		res.status(404).json({ 'mensaje': 'Articulo no encontrado' })
	}

	public async articulosByCarrera(req: Request, res: Response): Promise<void> {
		const { idCarrera } = req.params;
		const respuesta = await pool.query(`SELECT nombreArticulo FROM profesores, articulos, profesorYarticulo 
		WHERE profesores.idCarrera=${idCarrera} AND articuloyprofesor.idArticulo = articulos.idArticulo 
		AND articuloyprofesor.idProfesor = profesores.idProfesor;`)
		if (respuesta.length > 0) {
			res.json(respuesta)
			return;
		}
		res.status(404).json({ 'mensaje': 'Articulos no encontrados' })
	}

	public async createExterno(req: Request, res: Response): Promise<void> {
		const { idArticulo, pos } = req.params
		const resp = await pool.query('INSERT INTO externosAPA SET ?', [req.body])
		let hoy = new Date();
		let dato = {
			idProfesor: resp.insertId,
			idArticulo: idArticulo,
			pos: pos,
			validado: 1,
			fechaModificacion: hoy.getFullYear() + '-' + ('0' + (hoy.getMonth() + 1)).slice(-2) + '-' + ('0' + hoy.getDate()).slice(-2),
			esInterno: 0,
		}
		const resp2 = await pool.query('INSERT INTO profesorYarticulo SET ?', dato)
		res.json(resp2)
	}

	public async addAutoresUTM(req: Request, res: Response): Promise<void> {
		const { idArticulo } = req.params
		let profesores = req.body
		let resp: any;

		let hoy = new Date();
		let fecha = (hoy.getFullYear() + '-' + ('0' + (hoy.getMonth() + 1)).slice(-2) + '-' + ('0' + hoy.getDate()).slice(-2));
		for (var i = 0; i < profesores.length; i++) {
			resp = await pool.query(`INSERT INTO profesorYarticulo (idProfesor, idArticulo, pos, validado, fechaModificacion, esInterno) VALUES (${profesores[i].idProfesor},${idArticulo}, ${profesores[i].pos},'1', '${fecha}', '1')`)
		}
		res.json(resp)
	}

	public async listProfesorYArticulo(req: Request, res: Response): Promise<void> {
		const { idArticulo } = req.params;
		const respuesta = await pool.query(`SELECT idProfesor,pos FROM profesorYarticulo WHERE idArticulo = ${idArticulo} ORDER BY pos ASC`)
		res.json(respuesta)
	}

}

export const profesorYArticuloController = new ProfesorYArticuloController()
