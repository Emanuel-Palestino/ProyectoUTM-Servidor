import { Request, Response } from 'express'
import pool from '../database'

class ExternosApaController{
    public async list(req: Request, res: Response): Promise<void>{
        const respuesta = await pool.query('SELECT * FROM externosapa order by idExternoAPA');
		res.json(respuesta)
    }

    public async listOne(req: Request, res: Response): Promise<void>{
        const { idExternoAPA } = req.params;       //id para filtrar la consulta
		const respuesta = await pool.query('SELECT * FROM externosapa WHERE idExternoAPA = ?', [idExternoAPA]);
		if (respuesta.length > 0) {
			res.json(respuesta[0]);
			return;
		}
		res.status(404).json({ 'mensaje': 'Externo no encontrado'});
    }

    public async create(req: Request, res: Response): Promise<void> {
        const resp = await pool.query('INSERT INTO externosapa SET ?', [req.body]);
		res.json(resp);
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const {idExternoAPA} = req.params;
        const resp = await pool.query(`DELETE FROM externosapa WHERE idExternoAPA = ${idExternoAPA}`);
        res.json(resp);
    }

    public async update(req: Request, res: Response): Promise<void> {
        const {idExternoAPA} = req.params;
        const resp = await pool.query(`UPDATE externosapa set ? WHERE idExternoAPA = ?`,[req.body,idExternoAPA]);
        res.json(resp);
    }
}

export const externosApaController = new ExternosApaController();