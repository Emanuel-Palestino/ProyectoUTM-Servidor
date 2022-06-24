import { Request, Response } from 'express';
import pool from '../database';
class PatentesController {
	public async list(req: Request, res: Response): Promise<void> {
		const respuesta = await pool.query('SELECT * FROM patentes order by idPatente');
		res.json(respuesta);
	}
	public async listOne(req: Request, res: Response): Promise<void> {
		const { id } = req.params;
		let consulta = 'SELECT * FROM patentes WHERE idPatente = ' + id;
		const respuesta = await pool.query(consulta);
		if (respuesta.length > 0) {
			res.json(respuesta[0]);
			return;
		}
		res.status(404).json({ 'mensaje': 'Patente no encontrada' });
	}
	public async create(req: Request, res: Response): Promise<void> {
		const { idProfesor } = req.params
		const resp = await pool.query("INSERT INTO patentes set ?", [req.body]);
		let dato = {
			idProfesor: idProfesor,
			idPatente: resp.insertId,
			pos: 1,
			esInterno: 1
		}
		const resp2 = await pool.query('INSERT INTO profesorYpatente SET ?', dato)
		res.json(resp2);
	}

	public async delete(req: Request, res: Response): Promise<void> {
		const { id } = req.params
		let resp = await pool.query(`DELETE FROM profesorYpatente WHERE idPatente = ${id}`);
		resp = await pool.query(`DELETE FROM patentes WHERE idPatente = ${id}`);
		res.json(resp);
	}
	public async actualizar(req: Request, res: Response): Promise<void> {
		const { id } = req.params;
		const resp = await pool.query("UPDATE patentes set ? WHERE idPatente= ?", [req.body, id]);
		res.json(resp);
	}
  
	public async listPatentesByProfesorByPeriodo(req: Request, res: Response): Promise<void> {
		const { idProfesor, fechaIni, fechaFin } = req.params
		//una patente
		let respuesta = await pool.query(`SELECT P.idPatente, P.nombrePatente, P.registro, P.obtencion, P.resumen, P.comprobante FROM patentes as P INNER JOIN profesorYpatente PP ON PP.idPatente=P.idPatente WHERE PP.idProfesor=${idProfesor} AND registro >= '${fechaIni}' AND registro <= '${fechaFin}' AND esInterno=1`)
		//todos sus colaboradores
		for (let i = 0; i < respuesta.length; i++) {
			const respuesta2 = await pool.query('SELECT idProfesor, esInterno FROM profesorYpatente WHERE idPatente = ? ORDER BY pos', [respuesta[i].idPatente])
			respuesta[i].colaboradores = respuesta2
			for(let j=0; j < respuesta2.length; j++){
				if(respuesta2[j].esInterno==1){
					const colaborador = await pool.query('SELECT nombreProfesor,idProfesor FROM profesores WHERE idProfesor = ?', [respuesta2[j].idProfesor])
					const esInterno = await pool.query('SELECT esInterno,pos from profesorYpatente WHERE idProfesor=? AND esInterno=1',[idProfesor])
					colaborador[0].esInterno=esInterno[0].esInterno;
					colaborador[0].pos=esInterno[0].pos;
					respuesta[i].colaboradores[j]=colaborador[0]
				}
				else{
					const colaborador = await pool.query('SELECT nombreExterno AS nombreProfesor,idExternoPatente AS idProfesor FROM externosPatente WHERE idExternoPatente = ?', [respuesta2[j].idProfesor])
					const esInterno = await pool.query('SELECT esInterno,pos from profesorYpatente WHERE idProfesor=? AND esInterno=0',[idProfesor])
					colaborador[0].esInterno=esInterno[0].esInterno;
					colaborador[0].pos=esInterno[0].pos;
					respuesta[i].colaboradores[j]=colaborador[0]
				}
			}
		}
		res.json(respuesta)
	}
	
	public async listColaboradoresInternosPatentes(req: Request, res: Response): Promise<void> {
		const { idProfesor } = req.params;
		const resp = await pool.query(`SELECT DISTINCT CE.idProfesor, CE.nombreProfesor, CE.idCarrera, CE.idInstituto FROM profesores AS CE INNER JOIN profesorYpatente PYP ON CE.idProfesor = PYP.idProfesor INNER JOIN profesorYpatente P ON P.idPatente = PYP.idPatente WHERE PYP.esInterno = 1  AND P.esInterno = 1 AND P.idProfesor = ${idProfesor} AND CE.idProfesor !=${idProfesor}`);
		res.json(resp);
	}

	public async colaboradoresExternos(req: Request, res: Response) {
		const { idProfesor } = req.params
		const resp = await pool.query(`SELECT EP.idExternoPatente, EP.nombreExterno FROM ((patentes as P INNER JOIN profesorYpatente PP ON P.idPatente=PP.idPatente AND PP.idProfesor=${idProfesor} AND PP.esInterno=1) INNER JOIN profesorYpatente PP2 ON PP2.idPatente=P.idPatente) INNER JOIN externosPatente EP ON EP.idExternoPatente=PP2.idProfesor AND PP2.esInterno=0`)
		res.json(resp)
	}

	public async listColaboradoresExternosExistentesSinColaboracionPatentes(req: Request, res: Response){
		const {idProfesor} = req.params

		const respExternos = await pool.query(`SELECT idExternoPatente, nombreExterno from externosPatente where idExternoPatente NOT IN (SELECT idProfesor FROM profesorypatente WHERE idPatente IN (SELECT idPatente FROM profesorypatente WHERE idProfesor = ${idProfesor} and esinterno = 1)and esInterno=0);`);
		res.json(respExternos)
		
		/*let aux: any[] = []
		let respIdColaborador = []
		let respExternos = []

		//obtener los ids de las patentes en las que ha trabajado un profesor (interno)
		const respPatentes = await pool.query(`SELECT idPatente FROM profesorypatente WHERE idProfesor = ${idProfesor} AND esInterno = 1`)
		console.log(respPatentes);
		
		
		//obtener los ids de todos los colaboradores externos que trabajaron en las patentes anteriormente obtenidas
		for(let i = 0; i<respPatentes.length; i++){
			respIdColaborador = await pool.query(`SELECT idProfesor,esInterno From profesorypatente WHERE idPatente = ${respPatentes[i].idPatente} and esInterno = 0`)	
			for(let j = 0; j < respIdColaborador.length; j++){
				aux.push(respIdColaborador[j].idProfesor)
			}
		}
		
		
		respExternos = await pool.query(`SELECT idExternoPatente, nombreExterno from externosPatente`)
		
		
		let pos: any[] = []
		for(let i = respExternos.length-1; i>=0; i--){
				for(let j = 0; j<aux.length;j++){
					if(respExternos[i].idExternoPatente == aux[j]){
						pos.push(i)
					}
				}
			}

			console.log(pos);
			for(let i =0; i<pos.length;i++){
				respExternos.splice(pos[i],1)
			}*/
		


		

	}

	public async addColaboradoresPatenteUTM(req: Request, res: Response): Promise<void> {
		const { idPatente } = req.params
		const profesores = req.body
		let resp;
		for(let i = 0; i < profesores.length; i++){
			let profesor = profesores[i]
			profesor.esInterno = 1
			profesor.idPatente = idPatente
			resp = await pool.query("INSERT INTO profesorYpatente set ?", profesor);
		}
		res.json(resp);
	}

}
export const patentesController = new PatentesController();
