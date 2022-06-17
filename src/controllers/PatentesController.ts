import {Request,Response} from 'express';
import pool from '../database';
class PatentesController
{
	public async list(req: Request, res: Response ): Promise<void>
	{
		const respuesta = await pool.query('SELECT * FROM patentes order by idPatente');
		res.json( respuesta );
	}
	public async listOne(req: Request, res: Response): Promise <void>{
		const {id} = req.params;
		let consulta='SELECT * FROM patentes WHERE idPatente = '+id;
		const respuesta = await pool.query(consulta); 
		if(respuesta.length>0){
			res.json(respuesta[0]);
			return ;
		}
		res.status(404).json({'mensaje': 'Patente no encontrada'});
	}
	public async create (req:Request, res:Response): Promise <void>{
		console.log(req.body);
		const resp= await pool.query ("INSERT INTO patentes set ?", [req.body]);
		res.json(resp);
	}
	
	public async delete (req:Request, res:Response): Promise <void>{
		const {id} = req.params
		const resp= await pool.query (`DELETE FROM patentes WHERE idPatente = ${id}`);
		res.json(resp);
	}
	public async actualizar(req: Request, res: Response): Promise<void> {
		const { id } = req.params;
		const resp = await pool.query("UPDATE patentes set ? WHERE idPatente= ?", [req.body, id]);
		res.json(resp);
		}
	public async listColaboradoresInternosPatentes(req: Request, res: Response): Promise<void> {
		const { idProfesor } = req.params;
		const resp = await pool.query(`SELECT DISTINCT prof.idProfesor, prof.nombreProfesor,prof.idCarrera,prof.idInstituto from profesores AS prof INNER JOIN profesorYPatente pYP ON prof.idProfesor=pYP.idProfesor INNER JOIN profesorYPatente P ON P.idPatente=pYP.esInterno=1  AND P.esInterno=1 AND P.idProfesor=${idProfesor}`);
		res.json(resp);
	}
		
}
export const patentesController = new PatentesController();