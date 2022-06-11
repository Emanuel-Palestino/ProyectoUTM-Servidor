import { Request, Response } from 'express'
import pool from '../database'

class ComisionesController{
    public async list(req: Request, res: Response): Promise<void>{
        const respuesta = await pool.query('SELECT * FROM comisiones order by idComision');
		res.json(respuesta)
    }

    public async listOne(req: Request, res: Response): Promise<void>{
        const { idComision } = req.params;       //id para filtrar la consulta
		const respuesta = await pool.query('SELECT * FROM comisiones WHERE idComision = ?', [idComision]);
		if (respuesta.length > 0) {
			res.json(respuesta[0]);
			return;
		}
		res.status(404).json({ 'mensaje': 'Comisión no encontrada'});
    }

    public async create(req: Request, res: Response): Promise<void> {
        const resp = await pool.query('INSERT INTO comisiones SET ?', [req.body]);
		res.json(resp);
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const {idComision} = req.params;
        const resp = await pool.query(`DELETE FROM comisiones WHERE idComision = ${idComision}`);
        res.json(resp);
    }

    public async update(req: Request, res: Response): Promise<void> {
        const {idComision} = req.params;
        const resp = await pool.query(`UPDATE comisiones set ? WHERE idComision = ?`,[req.body,idComision]);
        res.json(resp);
    }
}

export const comisionesController = new ComisionesController();