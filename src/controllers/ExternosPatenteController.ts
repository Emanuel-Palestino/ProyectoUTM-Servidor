import {Request,Response} from 'express';
import pool from '../database';
class ExternosPatenteController
{
	public async list(req: Request, res: Response ): Promise<void>
	{
		const respuesta = await pool.query('SELECT * FROM externosPatente order by idExternoPatente');
		console.log(respuesta);
		res.json( respuesta );
	}
	public async listOne(req: Request, res: Response): Promise <void>{
		const {id} = req.params;
		let consulta='SELECT * FROM externosPatente WHERE idExternoPatente = '+id;
		const respuesta = await pool.query(consulta); 
		console.log(consulta);
		if(respuesta.length>0){
			res.json(respuesta[0]);
			return ;
		}
		res.status(404).json({'mensaje': 'tutorado no encontrado'});
	}
	public async create (req:Request, res:Response): Promise <void>{
		console.log(req.body);
		const resp= await pool.query ("INSERT INTO externosPatente set ?", [req.body]);
		res.json(resp);
	}
	
	public async delete (req:Request, res:Response): Promise <void>{
		const {id} = req.params
		const resp= await pool.query (`DELETE FROM externosPatente WHERE idExternoPatente = ${id}`);
		res.json(resp);
	}
	public async actualizar(req: Request, res: Response): Promise<void> {
		const { idExternoPatente } = req.params;
		console.log(req.params);
		const resp = await pool.query("UPDATE externosPatente set ? WHERE idExternoPatente= ?", [req.body, idExternoPatente]);
		res.json(resp);
		}
}
export const externosPatenteController = new ExternosPatenteController();