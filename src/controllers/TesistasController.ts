import { Request, Response } from 'express'
import pool from '../database'

class TesistasController {
    public async list(req: Request, res: Response ): Promise<void>
	{
		const respuesta = await pool.query('SELECT * FROM tesistas order by idTesis');
		res.json( respuesta );
	}
	public async listOne(req: Request, res: Response): Promise <void>{
		const {id} = req.params;
		let consulta='SELECT * FROM tesistas WHERE idTesis = '+id;
		const respuesta = await pool.query(consulta); 
		if(respuesta.length>0){
			res.json(respuesta[0]);
			return ;
		}
		res.status(404).json({'mensaje': 'tesistas no encontrado'});
	}
	public async create (req:Request, res:Response): Promise <void>{
		const resp= await pool.query ("INSERT INTO tesistas set ?", [req.body]);
		res.json(resp);
	}
	
	public async delete (req:Request, res:Response): Promise <void>{
		const {id} = req.params
		const resp= await pool.query (`DELETE FROM tesistas WHERE idTesis = ${id}`);
		res.json(resp);
	}
	public async update(req: Request, res: Response): Promise<void> {
		const { id } = req.params;
		const resp = await pool.query("UPDATE tesistas set ? WHERE idTesis= ?", [req.body, id]);
		res.json(resp);
	}
	public async listTesistasByProfesorByPeriodo(req: Request, res: Response): Promise<void>{
		const {idProfesor, fechaIni, fechaFin} = req.params
		let respNombres: ''
		let aux2: any[] = []
		const resp = await pool.query(`SELECT DISTINCT t.* FROM tesistas AS t INNER JOIN profesorYtesis AS pyt INNER JOIN profesores AS p WHERE pyt.idProfesor=${idProfesor} AND t.idTesis=pyt.idTesis AND t.inicio >= '${fechaIni}' and t.inicio <= '${fechaFin}'`)
		for(var i=0; i<resp.length;i++){
			const respColab = await pool.query(`SELECT idProfesor,esInterno FROM profesorYtesis where profesorYtesis.idTesis=${resp[i].idTesis} ORDER BY pos ASC`)
			console.log(respColab);
			let aux: any[] = []
			for(var j=0; j<respColab.length;j++){
				if (respColab[j].esInterno == "0"){
					respNombres = await pool.query(`SELECT nombreCodirector AS nombreProfesor, rol, esInterno FROM externoCodirector INNER JOIN profesorYtesis WHERE idExternoCodirector = ${respColab[j].idProfesor} AND idProfesor=${respColab[j].idProfesor}`)
				}
				else{
					respNombres =  await pool.query(`SELECT nombreProfesor, rol, esInterno FROM profesores INNER JOIN profesorYtesis WHERE profesores.idProfesor=${respColab[j].idProfesor} AND profesorYtesis.idProfesor=${respColab[j].idProfesor}`)
				}
				aux.push(respNombres[0]);
			}
			resp[i].profesores = aux;
		}
		console.log(aux2)
		//console.log(aux)
		res.json(resp)
	}
	
}

export const tesistasController = new TesistasController()