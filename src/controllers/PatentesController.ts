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
		let respuesta = await pool.query(`SELECT P.idPatente, P.nombrePatente, P.registro, P.obtencion, P.resumen, P.comprobante FROM patentes as P INNER JOIN profesorYpatente PP ON PP.idPatente=P.idPatente WHERE PP.idProfesor=${idProfesor} AND registro >= '${fechaIni}' AND registro <= '${fechaFin}'`)
		//todos sus colaboradores
		for (let i = 0; i < respuesta.length; i++) {
			const respuesta2 = await pool.query('SELECT idProfesor, esInterno FROM profesorYpatente WHERE idPatente = ? ORDER BY pos', [respuesta[i].idPatente])
			respuesta[i].colaboradores = respuesta2
			for(let j=0; j < respuesta2.length; j++){
				if(respuesta2[j].esInterno==1){
					const colaborador = await pool.query('SELECT nombreProfesor,idProfesor FROM profesores WHERE idProfesor = ?', [respuesta2[j].idProfesor])
					const esInterno = await pool.query('SELECT esInterno from profesorYpatente WHERE idProfesor=? AND esInterno=1',[idProfesor])
					colaborador[0].esInterno=esInterno[0].esInterno;
					respuesta[i].colaboradores[j]=colaborador
				}
				else{
					const colaborador = await pool.query('SELECT nombreExterno AS nombreProfesor,idExternoPatente AS idProfesor FROM externosPatente WHERE idExternoPatente = ?', [respuesta2[j].idProfesor])
					const esInterno = await pool.query('SELECT esInterno from profesorYpatente WHERE idProfesor=? AND esInterno=0',[idProfesor])
					colaborador[0].esInterno=esInterno[0].esInterno;
					respuesta[i].colaboradores[j]=colaborador
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

}
export const patentesController = new PatentesController();
