import { Request, Response } from 'express'
import pool from '../database'

class ProfesorYTesisController {
    public async list(req: Request, res: Response ): Promise<void>
	{
		const respuesta = await pool.query('SELECT * FROM profesorYTesis order by idTesis');
		console.log(respuesta);
		res.json( respuesta );
	}
	public async listOne(req: Request, res: Response): Promise <void>{
		const {id} = req.params;
		let consulta='SELECT * FROM profesorYTesis WHERE idTesis = '+id;
		const respuesta = await pool.query(consulta); 
		console.log(consulta);
		if(respuesta.length>0){
			res.json(respuesta[0]);
			return ;
		}
		res.status(404).json({'mensaje': 'profesorYTesis no encontrado'});
	}
	public async create (req:Request, res:Response): Promise <void>{
		const resp= await pool.query ("INSERT INTO profesorYTesis set ?", [req.body]);
		res.json(resp);
	}
	
	public async delete (req:Request, res:Response): Promise <void>{
		const {id} = req.params
		const resp= await pool.query (`DELETE FROM profesorYTesis WHERE idTesis = ${id}`);
		res.json(resp);
	}
	public async update(req: Request, res: Response): Promise<void> {
		const { id } = req.params;
		console.log(req.params);
		const resp = await pool.query("UPDATE profesorYTesis set ? WHERE idTesis= ?", [req.body, id]);
		res.json(resp);
		}
}

export const profesorYTesisController = new ProfesorYTesisController()