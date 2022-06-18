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
    public async listComisionesByProfesoByPeriodo(req: Request, res: Response): Promise<void> {
		const { idProfesor, fechaIni, fechaFin } = req.params
		let respuesta = await pool.query(`SELECT C.nombre,C.asignacion,C.periodo,C.inicio FROM comisiones as C INNER JOIN profesorYcomision PC ON PC.idComision=C.idComision WHERE PC.idProfesor=${idProfesor} AND inicio >= '${fechaIni}' AND fin <= '${fechaFin}'`)
		res.json(respuesta)
	}

    public async listarComisionesSinAsignar(req: Request, res: Response): Promise<void> {
        const respuesta = await pool.query('SELECT * FROM comisiones WHERE NOT EXISTS (SELECT *FROM profesorYComision WHERE idComision=comisiones.idComision)');
        res.json(respuesta)
    }
    
}

export const comisionesController = new ComisionesController();