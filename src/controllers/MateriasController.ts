import { Request, Response } from 'express'
import pool from '../database'

class MateriasController {

	public async create(req: Request, res: Response): Promise<void> {
		const resp = await pool.query('INSERT INTO materias SET ?', [req.body])
		res.json(resp)
	}

	public async list(req: Request, res: Response): Promise<void> {
		const respuesta = await pool.query('SELECT * FROM materias')
		res.json(respuesta)
	}

	public async listOne(req: Request, res: Response): Promise<void> {
		const { idMateria } = req.params;
		const respuesta = await pool.query('SELECT * FROM materias WHERE idMateria = ?', [idMateria])
		if (respuesta.length > 0) {
			res.json(respuesta[0])
			return;
		}
		res.status(404).json({ 'mensaje': 'materias no encontrada' })
	}

	public async update(req: Request, res: Response): Promise<void> {
		const { idMateria } = req.params
		const resp = await pool.query('UPDATE materias set ? WHERE idMateria=?', [req.body, idMateria])
		res.json(resp)
	}

	public async delete(req: Request, res: Response): Promise<void> {
		const { idMateria } = req.params
		const resp = await pool.query(`DELETE FROM materias WHERE idMateria=${idMateria}`)
		res.json(resp)
	}

	public async listMateriasByAnyoByPeriodo(req: Request, res: Response): Promise<void> {

		const { idProfesor, anyoIni, anyoFin } = req.params
		let consulta = `SELECT pym.idMateria, pym.grupo, c.nombreCarrera, pl.nombrePlan as plan, p.nombre as nombrePeriodo, p.actual FROM profesorYmateria pym INNER JOIN periodo as p ON p.idPeriodo = pym.idPeriodo INNER JOIN materias as m ON m.idMateria = pym.idMateria INNER JOIN planes as pl ON m.idPlan = pl.idPlan INNER JOIN carreras as c ON pl.idCarrera = c.idCarrera WHERE pym.idProfesor = ${idProfesor} AND p.fechaInicio >= '${anyoIni}' AND p.fechaFin <= '${anyoFin}';`

		const respuesta = await pool.query(consulta)
		res.json(respuesta)

	}
	public async listMateriasByAnyoByPeriodoMultiple(req: Request, res: Response): Promise<void> {

		const { idProfesor, anyoIni, anyoFin } = req.params
		let resp: any;
		let consulta = `SELECT pymm.idProfesorYmateriaMultiple,pymm.idMateria, c.nombreCarrera, pl.nombrePlan as plan, p.nombre as nombrePeriodo, p.actual FROM profesorYmateriaMultiple pymm INNER JOIN periodo as p ON p.idPeriodo = pymm.idPeriodo INNER JOIN materias as m ON m.idMateria = pymm.idMateria INNER JOIN planes as pl ON m.idPlan = pl.idPlan INNER JOIN carreras as c ON pl.idCarrera = c.idCarrera WHERE pymm.idProfesor = ${idProfesor} AND p.fechaInicio >= '${anyoIni}' AND p.fechaFin <= '${anyoFin}'`
		const respuesta = await pool.query(consulta)
		for (let i = 0; i < respuesta.length; i++) {
			resp = await pool.query(`SELECT grupo FROM gruposmultiples WHERE idProfesorYMateriaMultiple = ${respuesta[i].idProfesorYMateriaMultiple}`)
			respuesta[i].grupos = [];
			delete respuesta[i].idProfesorYMateriaMultiple
			resp.forEach((element: any) => {
				respuesta[i].grupos.push(element.grupo);

			});
		}
		res.json(respuesta)
	}
	public async listMateriasByCarreraByPeriodo(req: Request, res: Response): Promise<void> {
		const { idCarrera, idPeriodo } = req.params
		let respuestaMaterias: '';
		let consulta = await pool.query(`SELECT DISTINCT P.idProfesor, P.nombreProfesor FROM profesores AS P INNER JOIN profesorYmateria AS PM ON PM.idProfesor=P.idProfesor INNER JOIN materias M ON PM.idMateria=M.idMateria INNER JOIN planes AS PL ON PL.idPlan=M.idPlan WHERE PM.idPeriodo=${idPeriodo} AND PL.idCarrera=${idCarrera}`);
		for (let i = 0; i < consulta.length; i++) {
			let resp = await pool.query (`SELECT PM.idMateria FROM profesorYmateria AS PM WHERE PM.idProfesor=${consulta[i].idProfesor}`)
			let aux: any[] = [];
			for(let j=0; j< resp.length; j++){
				respuestaMaterias = await pool.query(`SELECT M.*, PM.idProfesorYMateria, PM.grupo, C.nombreCarrera FROM materias AS M INNER JOIN profesorYmateria AS PM ON M.idMateria=PM.idMateria INNER JOIN planes AS P ON M.idPlan=P.idPlan INNER JOIN carreras AS C ON P.idCarrera=C.idCarrera WHERE PM.idMateria=${resp[j].idMateria}`);
				aux.push(respuestaMaterias[0]);
			}
			consulta[i].materias = aux;
		}
		res.json(consulta)

	}
}

export const materiasController = new MateriasController();