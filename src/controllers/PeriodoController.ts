import {Request,Response} from 'express';
import pool from '../database';
class PeriodosController
{
	public async list(req: Request, res: Response ): Promise<void>
	{
		const respuesta = await pool.query('SELECT * FROM periodos order by idPeriodo ');
		console.log(respuesta);
		res.json( respuesta );
	}
	public async listOne(req: Request, res: Response): Promise <void>{
		const {id} = req.params;
		let consulta='SELECT * FROM periodos WHERE idPeriodo = '+id;
		const respuesta = await pool.query(consulta); 
		console.log(consulta);
		if(respuesta.length>0){
			res.json(respuesta[0]);
			return ;
		}
		res.status(404).json({'mensaje': 'periodos no encontrado'});
	}
	public async create (req:Request, res:Response): Promise <void>{
		console.log(req.body);
		const resp= await pool.query ("INSERT INTO periodos set ?", [req.body]);
		res.json(resp);
	}
	
	public async delete (req:Request, res:Response): Promise <void>{
		const {idPeriodo} = req.params
		const resp= await pool.query (`DELETE FROM periodos WHERE idPeriodo  = ${idPeriodo}`);
		res.json(resp);
	}
	public async update(req: Request, res: Response): Promise<void> {
		const { idPeriodo  } = req.params;  
		const resp = await pool.query("UPDATE periodos set ? WHERE idPeriodo = ?", [req.body, idPeriodo ]);
		res.json(resp);
		}
}
export const periodoController = new PeriodosController();