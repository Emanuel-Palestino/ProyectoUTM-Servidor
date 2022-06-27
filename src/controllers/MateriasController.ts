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
    public async listMateriasMultiplesByCarreraByPeriodo(req: Request, res: Response): Promise<void> {
        const{idCarrera,idPeriodo} = req.params;
        let consulta = `SELECT p.idProfesor, p.nombreProfesor FROM profesores as p INNER JOIN profesorYmateriaMultiple as pymm on pymm.idProfesor = p.idProfesor INNER JOIN periodo as pe ON pe.idPeriodo = pymm.idPeriodo INNER JOIN materias as m ON m.idMateria = pymm.idMateria INNER JOIN planes as pla ON pla.idPlan = m.idPlan INNER JOIN carreras as ca ON ca.idCarrera = pla.idCarrera WHERE ca.idCarrera = ${idCarrera} AND pe.idPeriodo = ${idPeriodo}`;
        const respuestaProfesores = await pool.query(consulta);
        for(let i = 0; i < respuestaProfesores.length; i++) {
            let consulta =`SELECT pymm.idMateria,pymm.idProfesorYMateriaMultiple,ma.semestre, pla.idPlan, ma.nombreMateria, ca.nombreCarrera, pe.nombre FROM profesorYmateriaMultiple as pymm INNER JOIN periodo as pe ON pymm.idPeriodo = pe.idPeriodo INNER JOIN materias as ma ON ma.idMateria = pymm.idMateria INNER JOIN planes as pla ON ma.idPlan = pla.idPlan INNER JOIN carreras as ca ON pla.idCarrera = ca.idCarrera WHERE pymm.idProfesor = ${respuestaProfesores[i].idProfesor}`;
            const respuestaAtributos = await pool.query(consulta);

            for(let j = 0; j < respuestaAtributos.length; j++) {
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