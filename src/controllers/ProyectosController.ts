import { Request, Response } from 'express'
import pool from '../database'

class ProyectosController {

	public async list(req: Request, res: Response): Promise<void> {
		const respuesta = await pool.query('SELECT * FROM proyectos')
		res.json(respuesta)
	}

	public async listOne(req: Request, res: Response): Promise<void> {
		const { idProyecto } = req.params;
		const respuesta = await pool.query('SELECT * FROM proyectos WHERE idProyecto = ?', [idProyecto])
		if (respuesta.length > 0) {
			res.json(respuesta[0])
			return;
		}
		res.status(404).json({ 'mensaje': 'Proyecto no encontrado' })
	}

	public async create(req:Request, res: Response): Promise<void> {
		const { idProfesor } = req.params
		const resp = await pool.query('INSERT INTO proyectos SET ?', [req.body])
		let dato =  {
			idProfesor : idProfesor,
			idProyecto: resp.insertId,
			pos: 1,
			esInterno: 1
		}
		const resp2 = await pool.query('INSERT INTO profesorYproyecto SET ?', dato)
		res.json(resp2)
	}

	public async delete(req:Request, res: Response): Promise<void> {
		const { idProyecto } = req.params
		let resp = await pool.query(`DELETE FROM profesorYproyecto WHERE idProyecto=${idProyecto}`)
		resp = await pool.query(`DELETE FROM proyectos WHERE idProyecto=${idProyecto}`)
		res.json(resp)
	}

	public async update(req: Request, res: Response): Promise<void> {
		const { idProyecto } = req.params
		const resp = await pool.query('UPDATE proyectos set ? WHERE idProyecto=?', [req.body, idProyecto])
		res.json(resp)
	}

	public async listColaboradoresExternosProyectos(req: Request, res: Response): Promise<void> {
		const { idProfesor } = req.params
        let consulta = `SELECT ep.idExternoProyecto as idExterno, ep.nombreExterno FROM profesoryproyecto as pyp INNER JOIN externosproyecto as ep ON pyp.idProfesor = ep.idExternoProyecto WHERE idProyecto = ANY (SELECT idProyecto from profesoryproyecto WHERE idProfesor = ${idProfesor} AND esInterno = 1) AND esInterno = 0;`
		const resp = await pool.query(consulta)
		res.json(resp)
	}

	public async listColaboradoresInternosProyectos(req: Request, res: Response): Promise<void> {
		const { idProfesor } = req.params;
		const respuesta = await pool.query(`SELECT DISTINCT CE.idProfesor, CE.nombreProfesor, CE.idCarrera, CE.idInstituto FROM profesores AS CE INNER JOIN profesorYproyecto PYP ON CE.idProfesor = PYP.idProfesor INNER JOIN profesorYproyecto P ON P.idProyecto = PYP.idProyecto WHERE PYP.esInterno = 1  AND P.esInterno = 1 AND P.idProfesor = ${idProfesor} AND CE.idProfesor !=${idProfesor}`);
		res.json(respuesta)
	}
	
	public async listProyectosByProfesorByPeriodo(req: Request, res: Response): Promise<void> {
		const { idProfesor, fechaIni, fechaFin} = req.params;
		let respuesta = await pool.query(`SELECT P.* FROM proyectos as P INNER JOIN profesorYproyecto PP ON PP.idProyecto = P.idProyecto WHERE PP.idProfesor=${idProfesor} AND inicio >= '${fechaIni}' AND fin <= '${fechaFin}'`)
	
		//Obtenemos los profesores participantes
		for(let i = 0; i < respuesta.length; i++) {
			//Obtenemos los colaboradores del proyecto
			const respuestaProyectos = await pool.query ('SELECT PP.* FROM profesoryproyecto AS PP WHERE PP.idProyecto = ? ORDER BY PP.pos' , respuesta[i].idProyecto);
			respuesta[i].colaboradores = respuestaProyectos;	
			
			for(let j = 0; j < respuestaProyectos.length; j++){
				if(respuestaProyectos[j].esInterno == 1){			//Comprobamos si el colaborador es interno de la UTM si el campo esInterno == 1
					const respuestaColaboradores = await pool.query('SELECT P.nombreProfesor AS nombreColaborador FROM profesores as P INNER JOIN profesorYproyecto PP ON PP.idProfesor = P.idProfesor WHERE PP.idProfesor = ?',respuestaProyectos[j].idProfesor);
					respuesta[i].colaboradores[j] = respuestaColaboradores;
				}else{												//Si no es un colaborador externo
					const respuestaColaboradores = await pool.query('SELECT E.nombreExterno AS nombreColaborador FROM externosproyecto as E INNER JOIN profesorYproyecto PP ON PP.idProfesor = E.idExternoProyecto WHERE E.idExternoProyecto = ?',respuestaProyectos[j].idProfesor);
					respuesta[i].colaboradores[j] = respuestaColaboradores;
				}
			}
		}

		res.json(respuesta);
	}

}

export const proyectosController = new ProyectosController()