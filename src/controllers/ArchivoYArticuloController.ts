import { Request, Response } from 'express'
import pool from '../database'

class ArchivoYArticuloController {

	public async archivosPorArticulo(req: Request, res: Response): Promise<void> {
		const { idArticulo } = req.params;
		const respuesta = await pool.query('SELECT * FROM archivoYArticulo WHERE idArchivoYArticulo = ?', [idArticulo])
		if (respuesta.length > 0) {
			res.json(respuesta[0])
			return;
		}
		res.status(404).json({ 'mensaje': 'Archivos no encontrados' })
	}

}

export const archivoYArticuloController = new ArchivoYArticuloController()