import {Request,Response} from 'express';
import pool from '../database';
class TutoradoController
{
	public async list(req: Request, res: Response ): Promise<void>
	{
		const respuesta = await pool.query('SELECT * FROM tutorado order by idTutorado');
		console.log(respuesta);
		res.json( respuesta );
	}
	public async listOne(req: Request, res: Response): Promise <void>{
		const {id} = req.params;
		let consulta='SELECT * FROM tutorado WHERE idTutorado = '+id;
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
		const resp= await pool.query ("INSERT INTO tutorado set ?", [req.body]);
		res.json(resp);
	}
	
	public async delete (req:Request, res:Response): Promise <void>{
		const {id} = req.params
		const resp= await pool.query (`DELETE FROM tutorado WHERE idTutorado = ${id}`);
		res.json(resp);
	}
	public async actualizar(req: Request, res: Response): Promise<void> {
		const { idTutorado } = req.params;
		console.log(req.params);
		const resp = await pool.query("UPDATE tutorado set ? WHERE idTutorado= ?", [req.body, idTutorado]);
		res.json(resp);
		}
}
export const tutoradoController = new TutoradoController();