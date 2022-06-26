import { compareSync } from 'bcryptjs'
import { Request, Response } from 'express'
import pool from '../database'

class MateriasController {

    public async create(req:Request, res: Response): Promise<void> {
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

	public async delete(req:Request, res: Response): Promise<void> {
		const { idMateria } = req.params
		const resp = await pool.query(`DELETE FROM materias WHERE idMateria=${idMateria}`)
		res.json(resp)
	}
    
    public async listMateriasByAnyoByPeriodo(req:Request, res: Response): Promise<void> {

        const {idProfesor,anyoIni,anyoFin} = req.params
        let consulta = `SELECT pym.idMateria, pym.grupo, c.nombreCarrera, pl.nombrePlan as plan, p.nombre as nombrePeriodo, p.actual FROM profesorYmateria pym INNER JOIN periodo as p ON p.idPeriodo = pym.idPeriodo INNER JOIN materias as m ON m.idMateria = pym.idMateria INNER JOIN planes as pl ON m.idPlan = pl.idPlan INNER JOIN carreras as c ON pl.idCarrera = c.idCarrera WHERE pym.idProfesor = ${idProfesor} AND p.fechaInicio >= '${anyoIni}' AND p.fechaFin <= '${anyoFin}';`

		const respuesta = await pool.query(consulta)
        res.json(respuesta)

	}
	public async listMateriasByAnyoByPeriodoMultiple(req:Request, res: Response): Promise<void> {

        const {idProfesor,anyoIni,anyoFin} = req.params
		let resp: any;
        let consulta = `SELECT pymm.idProfesorYmateriaMultiple,pymm.idMateria, c.nombreCarrera, pl.nombrePlan as plan, p.nombre as nombrePeriodo, p.actual FROM profesorYmateriaMultiple pymm INNER JOIN periodo as p ON p.idPeriodo = pymm.idPeriodo INNER JOIN materias as m ON m.idMateria = pymm.idMateria INNER JOIN planes as pl ON m.idPlan = pl.idPlan INNER JOIN carreras as c ON pl.idCarrera = c.idCarrera WHERE pymm.idProfesor = ${idProfesor} AND p.fechaInicio >= '${anyoIni}' AND p.fechaFin <= '${anyoFin}'`
		const respuesta = await pool.query(consulta)
		for (let i = 0; i < respuesta.length; i++){
			resp = await pool.query(`SELECT grupo FROM gruposmultiples WHERE idProfesorYMateriaMultiple = ${respuesta[i].idProfesorYMateriaMultiple}`)
			respuesta[i].grupos = [];
			delete respuesta[i].idProfesorYMateriaMultiple
			resp.forEach((element:any) => {
				respuesta[i].grupos.push(element.grupo);
				
			});
		}
        res.json(respuesta)
	}

	public async listMateriasByPlanBySemestreByPeriodo(req:Request, res: Response): Promise<void> {

        const {idPlan,semestre,AnyoI,AnyoF} = req.params
		let resp: any;
        let consulta = `SELECT DISTINCT M.nombreMateria, M.semestre FROM profesorYmateria PM INNER JOIN materias AS M ON M.idPlan=${idPlan} AND M.semestre=${semestre} AND M.idMateria=PM.idMateria`
		//console.log(consulta)
		let respuesta2 :any=[];
		const respuesta = await pool.query(consulta)
		console.log(respuesta.length);
		//res.json(respuesta)
		for (let i = 0; i < respuesta.length; i++){
			respuesta[0].profesores = await pool.query(`SELECT PR.nombreProfesor,P.anyo,P.nombre FROM ((profesorYmateria AS PM INNER JOIN materias AS M ON M.nombreMateria="${respuesta[i].nombreMateria}" AND M.semestre=${semestre} AND PM.idMateria=M.idMateria) INNER JOIN profesores AS PR ON PM.idProfesor=PR.idProfesor) INNER JOIN periodo AS P ON P.fechaInicio>='${AnyoI}' AND P.fechaFin<='${AnyoF}' AND P.idPeriodo=PM.idPeriodo`)
			//console.log("profes",resp)
			//respuesta[0].profesores=resp;
		}
		//console.log(respuesta)
        res.json(respuesta)
	}

}

export const materiasController = new MateriasController();