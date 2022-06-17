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
		console.log(req.body);
		const resp = await pool.query("INSERT INTO patentes set ?", [req.body]);
		res.json(resp);
	}

	public async delete(req: Request, res: Response): Promise<void> {
		const { id } = req.params
		const resp = await pool.query(`DELETE FROM patentes WHERE idPatente = ${id}`);
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
		let colaboradores:any
		let respuesta = await pool.query(`SELECT P.idPatente, P.nombrePatente, P.registro, P.obtencion, P.resumen, P.comprobante FROM patentes as P INNER JOIN profesorYPatente PP ON PP.idPatente=P.idPatente WHERE PP.idProfesor=${idProfesor} AND registro >= '${fechaIni}' AND registro <= '${fechaFin}'`)
		//todos sus colaboradores
		for (let i = 0; i < respuesta.length; i++) {
			let respuesta2 = await pool.query('SELECT idProfesor, esInterno FROM profesorYPatente WHERE idPatente = ? ORDER BY pos', [respuesta[i].idPatente])
			for(let j=0; j < respuesta2.length; j++){
				if(respuesta2[j].esInterno==1){
					let colaborador = await pool.query('SELECT nombreExterno FROM externosPatentes WHERE idExternoPatente = ?', [respuesta2[j].idProfesor])
					colaboradores[j]=colaborador
				}
				if(respuesta2[j].esInterno==0){
					let colaborador = await pool.query('SELECT nombreProfesor FROM profesores WHERE idProfesor = ?', [respuesta2[j].idProfesor])
					colaboradores[j]=colaborador
				}
			}
			respuesta[i].colaboradores=colaboradores
		}
		res.json(respuesta)
	}
}
export const patentesController = new PatentesController();
