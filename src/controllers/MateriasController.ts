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

	public async listMateriasByPlanByPeriodoConProfesores(req:Request, res: Response):Promise<void>{
		const {idPlan,AnyoI,AnyoF} = req.params;
		let materias = await pool.query(`SELECT idMateria,nombreMateria,semestre FROM materias WHERE idPlan = ${idPlan}`);

		for(let i = 0;i < materias.length;i++){
			let profesores:any[]=[];
			let profesor = await pool.query(`SELECT pf.nombreProfesor,pdo.nombre,pdo.anyo FROM profesorYmateria AS pym INNER JOIN profesores AS pf ON pym.idProfesor = pf.idProfesor INNER JOIN periodo AS pdo ON pdo.idPeriodo = pym.idPeriodo WHERE pym.idMateria = ${materias[i].idMateria} AND pdo.anyo >='${AnyoI}' AND pdo.anyo<='${AnyoF}' ORDER BY pdo.anyo ASC`);
			profesores.push(profesor);

			delete materias[i].idMateria;
			materias[i].profesores = profesores[0];
		}
		
		res.json(materias);

	}

	public async asignarMultiAsignacion(req:Request, res:Response):Promise <void>{
		const {idProfesor} = req.params;
		let periodo = await pool.query('SELECT idPeriodo FROM periodo WHERE  actual = 1');
		console.log("Periodo: "+periodo[0].idPeriodo)
		const dat_pym = {
			idMateria:req.body.idMateria,
			idPeriodo:periodo[0].idPeriodo,
			idProfesor:idProfesor
		}

		let createPyM =  await pool.query('INSERT INTO profesorYmateriaMultiple SET ?',dat_pym);
		let carrera = await pool.query(`SELECT idCarrera FROM planes WHERE idPlan = ${req.body.idPlan}`);

		const grup_multi = {			
			idProfesorYMateriaMultiple:createPyM.insertId,
			idCarrera:carrera[0].idCarrera,
			idPlan:req.body.idPlan,
			semestre:req.body.semestre,
			grupo:req.body.grupo
		}

		let grupos = await pool.query('INSERT INTO gruposMultiples SET ?',grup_multi);
		res.json(grupos);
	}
}

export const materiasController = new MateriasController();