import {Request,Response} from 'express';
import pool from '../database';
class PlanControllers
{
	public async list(req: Request, res: Response ): Promise<void>
	{
		const respuesta = await pool.query('SELECT * FROM planes order by idPlan');
		res.json( respuesta );
	}
	public async listOne(req: Request, res: Response): Promise <void>{
		const {id} = req.params;
		let consulta='SELECT * FROM planes WHERE idPlan = '+id;
		const respuesta = await pool.query(consulta); 
		if(respuesta.length>0){
			res.json(respuesta[0]);
			return ;
		}
		res.status(404).json({'mensaje': 'Plan no encontrado'});
	}
	public async create (req:Request, res:Response): Promise <void>{
		console.log(req.body);
		const resp= await pool.query ("INSERT INTO planes set ?", [req.body]);
		res.json(resp);
	}
	
	public async delete (req:Request, res:Response): Promise <void>{
		const {id} = req.params
		const resp= await pool.query (`DELETE FROM planes WHERE idPlan = ${id}`);
		res.json(resp);
	}
	public async actualizar(req: Request, res: Response): Promise<void> {
		const { id } = req.params;
		const resp = await pool.query("UPDATE planes set ? WHERE idPlan= ?", [req.body, id]);
		res.json(resp);
		}
}
export const planesController = new PlanControllers();