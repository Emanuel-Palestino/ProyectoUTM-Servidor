import { json, Request, Response } from 'express'
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
	public async listMateriasMultiasignacionByPeriodoByProfesor(req: Request, res: Response): Promise<void> {
		const {idPeriodo,idProfesor}=req.params
		const respuesta =await pool.query('SELECT p.idProfesor,p.nombreProfesor FROM `profesores`  AS p WHERE p.idProfesor=?',[idProfesor])
		const materias=await pool.query('SELECT m.idMateria,pymm.idProfesorYMateriaMultiple,m.semestre,m.idPlan,m.nombreMateria,c.nombreCarrera,pe.nombre FROM gruposMultiples  JOIN profesorYmateriaMultiple AS pymm ON pymm.idProfesorYMateriaMultiple=gruposMultiples.idProfesorYMateriaMultiple JOIN materias AS m ON m.idMateria=pymm.idMateria JOIN periodo AS pe ON pe.idPeriodo=pymm.idPeriodo JOIN carreras AS c ON c.idCarrera=gruposMultiples.idCarrera WHERE pe.idPeriodo=? AND pymm.idProfesor=?',[idPeriodo,idProfesor])
		const grupos = await pool.query('SELECT gp.idProfesorYMateriaMultiple,gp.idCarrera,gp.idPlan,gp.semestre,gp.grupo FROM `gruposMultiples` AS gp JOIN profesorYmateriaMultiple AS pymm ON pymm.idProfesorYMateriaMultiple=gp.idProfesorYMateriaMultiple JOIN periodo AS pe ON pe.idPeriodo=pymm.idPeriodo WHERE pe.idPeriodo=? AND pymm.idProfesor=?',[idPeriodo,idProfesor])
		respuesta[0].materias=materias
		respuesta[0].grupos=grupos
		res.json(respuesta)
	}

}

export const materiasController = new MateriasController();