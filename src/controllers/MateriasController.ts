import { compareSync } from 'bcryptjs'
import { json, Request, Response } from 'express'
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
		let consulta = `SELECT pym.idMateria, pym.grupo, c.nombreCarrera, pl.nombrePlan as plan, p.nombre as nombrePeriodo, p.actual FROM profesorYmateria pym INNER JOIN periodo as p ON p.idPeriodo = pym.idPeriodo INNER JOIN materias as m ON m.idMateria = pym.idMateria INNER JOIN planes as pl ON m.idPlan = pl.idPlan INNER JOIN carreras as c ON pl.idCarrera = c.idCarrera WHERE pym.idProfesor = ${idProfesor} AND p.anyo >= '${anyoIni}' AND p.anyo <= '${anyoFin}';`

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
			let resp = await pool.query(`SELECT PM.idMateria FROM profesorYmateria AS PM WHERE PM.idProfesor=${consulta[i].idProfesor}`)
			let aux: any[] = [];
			for (let j = 0; j < resp.length; j++) {
				respuestaMaterias = await pool.query(`SELECT M.*, PM.idProfesorYMateria, PM.grupo, C.nombreCarrera FROM materias AS M INNER JOIN profesorYmateria AS PM ON M.idMateria=PM.idMateria INNER JOIN planes AS P ON M.idPlan=P.idPlan INNER JOIN carreras AS C ON P.idCarrera=C.idCarrera WHERE PM.idMateria=${resp[j].idMateria}`);
				aux.push(respuestaMaterias[0]);
			}
			consulta[i].materias = aux;
		}
		res.json(consulta)

	}

	public async listMateriasByPlanBySemestreByPeriodo(req: Request, res: Response): Promise<void> {

		const { idPlan, semestre, AnyoI, AnyoF } = req.params
		let resp: any;
		let consulta = `SELECT DISTINCT M.nombreMateria, M.semestre FROM profesorYmateria PM INNER JOIN materias AS M ON M.idPlan=${idPlan} AND M.semestre=${semestre} AND M.idMateria=PM.idMateria`
		let respuesta2: any = [];
		const respuesta = await pool.query(consulta)
		for (let i = 0; i < respuesta.length; i++) {
			respuesta[0].profesores = await pool.query(`SELECT PR.nombreProfesor,P.anyo,P.nombre FROM ((profesorYmateria AS PM INNER JOIN materias AS M ON M.nombreMateria="${respuesta[i].nombreMateria}" AND M.semestre=${semestre} AND PM.idMateria=M.idMateria) INNER JOIN profesores AS PR ON PM.idProfesor=PR.idProfesor) INNER JOIN periodo AS P ON P.fechaInicio>='${AnyoI}' AND P.fechaFin<='${AnyoF}' AND P.idPeriodo=PM.idPeriodo`)
		}
		res.json(respuesta)
	}

	public async listMateriasMultiasignacionByPeriodoByProfesor(req: Request, res: Response): Promise<void> {
		const { idPeriodo, idProfesor } = req.params
		const respuesta = await pool.query('SELECT p.idProfesor,p.nombreProfesor FROM `profesores`  AS p WHERE p.idProfesor=?', [idProfesor])
		const materias = await pool.query('SELECT m.idMateria,pymm.idProfesorYMateriaMultiple,m.semestre,m.idPlan,m.nombreMateria,c.nombreCarrera,pe.nombre FROM gruposMultiples  JOIN profesorYmateriaMultiple AS pymm ON pymm.idProfesorYMateriaMultiple=gruposMultiples.idProfesorYMateriaMultiple JOIN materias AS m ON m.idMateria=pymm.idMateria JOIN periodo AS pe ON pe.idPeriodo=pymm.idPeriodo JOIN carreras AS c ON c.idCarrera=gruposMultiples.idCarrera WHERE pe.idPeriodo=? AND pymm.idProfesor=?', [idPeriodo, idProfesor])
		const grupos = await pool.query('SELECT gp.idProfesorYMateriaMultiple,gp.idCarrera,gp.idPlan,gp.semestre,gp.grupo FROM `gruposMultiples` AS gp JOIN profesorYmateriaMultiple AS pymm ON pymm.idProfesorYMateriaMultiple=gp.idProfesorYMateriaMultiple JOIN periodo AS pe ON pe.idPeriodo=pymm.idPeriodo WHERE pe.idPeriodo=? AND pymm.idProfesor=?', [idPeriodo, idProfesor])
		respuesta[0].materias = materias
		respuesta[0].grupos = grupos
		res.json(respuesta)
	}

	public async listMateriasByPlan(req: Request, res: Response): Promise<void> {
		const { idPlan } = req.params
		let resp = await pool.query(`SELECT idMateria, nombreMateria, idPlan, semestre FROM materias where idPlan = ${idPlan} ORDER BY semestre`)
		res.json(resp)
	}

	public async listMateriasByPeriodoByProfesor(req: Request, res: Response) {
		const { idPeriodo, idProfesor } = req.params
		let profesor = await pool.query(`SELECT idProfesor, nombreProfesor FROM profesores where idProfesor = ${idProfesor}`)
		const materias = await pool.query(`SELECT pym.idMateria,m.semestre,m.idPlan,m.nombreMateria,pym.grupo, c.nombreCarrera 
		FROM profesorymateria AS pym 
		INNER JOIN carreras AS c 
		INNER JOIN materias AS m
		INNER JOIN planes AS p 
		where pym.idProfesor=${idProfesor} AND pym.idPeriodo=${idPeriodo} 
		AND pym.idMateria=m.idMateria
		AND m.idPlan=p.idPlan
		AND p.idCarrera = c.idCarrera`)
		//esos del cliente no train
		profesor[0].materias = materias

		res.json(materias)
	}

	public async listMateriasByPlanByPeriodoConProfesores(req: Request, res: Response): Promise<void> {
		const { idPlan, AnyoI, AnyoF } = req.params;
		let materias = await pool.query(`SELECT idMateria,nombreMateria,semestre FROM materias WHERE idPlan = ${idPlan}`);

		for (let i = 0; i < materias.length; i++) {
			let profesores: any[] = [];
			let profesor = await pool.query(`SELECT pf.nombreProfesor,pdo.nombre,pdo.anyo FROM profesorYmateria AS pym INNER JOIN profesores AS pf ON pym.idProfesor = pf.idProfesor INNER JOIN periodo AS pdo ON pdo.idPeriodo = pym.idPeriodo WHERE pym.idMateria = ${materias[i].idMateria} AND pdo.anyo >='${AnyoI}' AND pdo.anyo<='${AnyoF}' ORDER BY pdo.anyo ASC`);
			profesores.push(profesor);

			delete materias[i].idMateria;
			materias[i].profesores = profesores[0];
		}

		res.json(materias);

	}

	public async asignarMultiAsignacion(req: Request, res: Response): Promise<void> {
		const { idProfesor } = req.params;
		let periodo = await pool.query('SELECT idPeriodo FROM periodo WHERE  actual = 1');
		const dat_pym = {
			idMateria: req.body.idMateria,
			idPeriodo: periodo[0].idPeriodo,
			idProfesor: idProfesor
		}

		let createPyM = await pool.query('INSERT INTO profesorYmateriaMultiple SET ?', dat_pym);
		let carrera = await pool.query(`SELECT idCarrera FROM planes WHERE idPlan = ${req.body.idPlan}`);

		const grup_multi = {
			idProfesorYMateriaMultiple: createPyM.insertId,
			idCarrera: carrera[0].idCarrera,
			idPlan: req.body.idPlan,
			semestre: req.body.semestre,
			grupo: req.body.grupo
		}

		let grupos = await pool.query('INSERT INTO gruposMultiples SET ?', grup_multi);
		res.json(grupos);
	}

	public async listMateriasMultiplesByCarreraByPeriodo(req: Request, res: Response): Promise<void> {
		const { idCarrera, idPeriodo } = req.params;
		let consulta = `SELECT p.idProfesor, p.nombreProfesor FROM profesores as p INNER JOIN profesorYmateriaMultiple as pymm on pymm.idProfesor = p.idProfesor INNER JOIN periodo as pe ON pe.idPeriodo = pymm.idPeriodo INNER JOIN materias as m ON m.idMateria = pymm.idMateria INNER JOIN planes as pla ON pla.idPlan = m.idPlan INNER JOIN carreras as ca ON ca.idCarrera = pla.idCarrera WHERE ca.idCarrera = ${idCarrera} AND pe.idPeriodo = ${idPeriodo}`;
		const respuestaProfesores = await pool.query(consulta);
		for (let i = 0; i < respuestaProfesores.length; i++) {
			let consulta = `SELECT pymm.idMateria,pymm.idProfesorYMateriaMultiple,ma.semestre, pla.idPlan, ma.nombreMateria, ca.nombreCarrera, pe.nombre FROM profesorYmateriaMultiple as pymm INNER JOIN periodo as pe ON pymm.idPeriodo = pe.idPeriodo INNER JOIN materias as ma ON ma.idMateria = pymm.idMateria INNER JOIN planes as pla ON ma.idPlan = pla.idPlan INNER JOIN carreras as ca ON pla.idCarrera = ca.idCarrera WHERE pymm.idProfesor = ${respuestaProfesores[i].idProfesor}`;
			const respuestaAtributos = await pool.query(consulta);

			for (let j = 0; j < respuestaAtributos.length; j++) {
				let consulta = `SELECT * FROM gruposMultiples WHERE idProfesorYMateriaMultiple = ${respuestaAtributos[j].idProfesorYMateriaMultiple}`

				const respuestaGrupos = await pool.query(consulta);
				respuestaAtributos[j].grupos = respuestaGrupos;
			}
			respuestaProfesores[i].atributos = respuestaAtributos;
		}
		res.json(respuestaProfesores)
	}

}

export const materiasController = new MateriasController();