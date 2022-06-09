import { Request, Response } from 'express'
import pool from '../database'

class ProfesorYArticuloController {

	public async list(req: Request, res: Response): Promise<void> {
		const respuesta = await pool.query('SELECT * FROM profesorYArticulo order by idArticuloYProfesor')
		res.json(respuesta)
	}

	public async listOne(req: Request, res: Response): Promise<void> {
		const { id } = req.params;
		const respuesta = await pool.query('SELECT * FROM profesorYArticulo WHERE idArticuloYProfesor = ?', [id])
		if (respuesta.length > 0) {
			res.json(respuesta[0])
			return;
		}
		res.status(404).json({ 'mensaje': 'Fila no encontrada' })
	}

	public async create(req:Request, res: Response): Promise<void> {
		const resp = await pool.query('INSERT INTO profesorYArticulo SET ?', [req.body])
		res.json(resp)
	}

	public async delete(req:Request, res: Response): Promise<void> {
		const { idArticuloYProfesor } = req.params
		const resp = await pool.query(`DELETE FROM profesorYArticulo WHERE idArticuloYProfesor=${idArticuloYProfesor}`)
		res.json(resp)
	}

	public async update(req: Request, res: Response): Promise<void> {
		const { idArticuloYProfesor } = req.params
		const resp = await pool.query('UPDATE profesorYArticulo set ? WHERE idArticuloYProfesor=?', [req.body, idArticuloYProfesor])
		res.json(resp)
	}

	public async profesoresByArticulo(req: Request, res: Response): Promise<void> {
		const { idArticulo } = req.params;
		const respuesta = await pool.query(`SELECT nombres FROM profesores, articulos, profesorYArticulo 
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
		const respuesta = await pool.query(`SELECT nombreArticulo FROM profesores, articulos, profesorYArticulo 
		WHERE profesores.idCarrera=${idCarrera} AND articuloyprofesor.idArticulo = articulos.idArticulo 
		AND articuloyprofesor.idProfesor = profesores.idProfesor;`)
		if (respuesta.length > 0) {
			res.json(respuesta)
			return;
		}
		res.status(404).json({ 'mensaje': 'Articulos no encontrados' })
	}

}

export const profesorYArticuloController = new ProfesorYArticuloController()