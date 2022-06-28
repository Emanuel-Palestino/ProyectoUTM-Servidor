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
		const { idProfesor } = req.params
		let resp = await pool.query ("INSERT INTO tesistas set ?", [req.body]);
		let dato = {
			idProfesor: idProfesor,
			idTesis: resp.insertId,
			pos: 1,
			rol: '1',
			esInterno: 1
		}
		resp = await pool.query('INSERT INTO profesorYtesis SET ?', dato)
		res.json(resp);
	}
	
	public async delete (req:Request, res:Response): Promise <void>{
		const {id} = req.params
		let resp = await pool.query (`DELETE FROM profesorYtesis WHERE idTesis = ${id}`);
		resp = await pool.query (`DELETE FROM tesistas WHERE idTesis = ${id}`);
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
		const resp = await pool.query(`SELECT DISTINCT t.* FROM tesistas AS t INNER JOIN profesorYtesis AS pyt INNER JOIN profesores AS p WHERE pyt.esInterno = 1 and pyt.idProfesor=${idProfesor} AND t.idTesis=pyt.idTesis AND t.inicio >= '${fechaIni}' and t.fin <= '${fechaFin} '`)
		for(var i=0; i<resp.length;i++){
			const respColab = await pool.query(`SELECT idProfesor,esInterno FROM profesorYtesis where profesorYtesis.idTesis=${resp[i].idTesis} ORDER BY pos ASC`)
			console.log(respColab);
			let aux: any[] = []
			for(var j=0; j<respColab.length;j++){
				if (respColab[j].esInterno == "0"){
					respNombres = await pool.query(`SELECT nombreCodirector AS nombreProfesor, rol, pos, esInterno FROM externoCodirector INNER JOIN profesorYtesis WHERE idExternoCodirector = ${respColab[j].idProfesor} AND idProfesor=${respColab[j].idProfesor}`)
				}
				else{
					respNombres =  await pool.query(`SELECT nombreProfesor, rol, pos, esInterno FROM profesores INNER JOIN profesorYtesis WHERE profesores.idProfesor=${respColab[j].idProfesor} AND profesorYtesis.idProfesor=${respColab[j].idProfesor}`)
				}
				aux.push(respNombres[0]);
			}
			resp[i].profesores = aux;
		}
		console.log(aux2)
		//console.log(aux)
		res.json(resp)
	}

	public async listCodirectoresExternosSugerencias(req: Request, res: Response): Promise<void>{
		//Soym eml Leom Memmsim deml bamckemnd ᕦ(ò_óˇ)ᕤ
		//metodo para obtener los coodirectores Externos que no han coincidido en alguna tesis con el el profesor obtenido a traves de su idProfesor
		const {idProfesor} = req.params
		const resp = await pool.query(`SELECT idExternoCodirector, nombreCodirector FROM externoCodirector where idExternoCodirector NOT IN (SELECT idProfesor FROM profesorytesis where idTesis IN (SELECT idTesis FROM profesorytesis where idProfesor=${idProfesor} and esInterno = 1) and esInterno = 0)`)
		res.json(resp)
	}
	
}

export const tesistasController = new TesistasController()