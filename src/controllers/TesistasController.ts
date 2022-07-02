import { Request, Response } from 'express'
import pool from '../database'

class TesistasController {

	public async list(req: Request, res: Response): Promise<void> {
		const respuesta = await pool.query('SELECT * FROM tesistas order by idTesis');
		res.json(respuesta);
	}

	public async listOne(req: Request, res: Response): Promise<void> {
		const { id } = req.params;
		let consulta = 'SELECT * FROM tesistas WHERE idTesis = ' + id;
		const respuesta = await pool.query(consulta);
		if (respuesta.length > 0) {
			res.json(respuesta[0]);
			return;
		}
		res.status(404).json({ 'mensaje': 'tesistas no encontrado' });
	}

	public async create(req: Request, res: Response): Promise<void> {
		const { idProfesor } = req.params
		let resp = await pool.query("INSERT INTO tesistas set ?", [req.body]);
		let dato = {
			idProfesor: idProfesor,
			idTesis: resp.insertId,
			pos: 1,
			rol: '1',
			esInterno: 1
		}
		resp = await pool.query('INSERT INTO profesorYtesis SET ?', dato)
		res.json(resp);
	}

	public async delete(req: Request, res: Response): Promise<void> {
		const { id } = req.params
		let resp = await pool.query(`DELETE FROM profesorYtesis WHERE idTesis = ${id}`);
		resp = await pool.query(`DELETE FROM tesistas WHERE idTesis = ${id}`);
		res.json(resp);
	}
	
	public async update(req: Request, res: Response): Promise<void> {
		const { id } = req.params;
		const resp = await pool.query("UPDATE tesistas set ? WHERE idTesis= ?", [req.body, id]);
		res.json(resp);
	}

	public async listTesistasByProfesorByPeriodo(req: Request, res: Response): Promise<void> {
		const { idProfesor, fechaIni, fechaFin } = req.params
		let respNombres: ''
		let aux2: any[] = []
		const resp = await pool.query(`SELECT DISTINCT t.* FROM tesistas AS t INNER JOIN profesorYtesis AS pyt INNER JOIN profesores AS p WHERE pyt.esInterno = 1 and pyt.idProfesor=${idProfesor} AND t.idTesis=pyt.idTesis AND t.inicio >= '${fechaIni}' and t.fin <= '${fechaFin} '`)
		for (var i = 0; i < resp.length; i++) {
			const respColab = await pool.query(`SELECT idProfesor,esInterno FROM profesorYtesis where profesorYtesis.idTesis=${resp[i].idTesis} ORDER BY pos ASC`)
			let aux: any[] = []
			for (var j = 0; j < respColab.length; j++) {
				if (respColab[j].esInterno == "0") {
					respNombres = await pool.query(`SELECT nombreCodirector AS nombreProfesor, rol, pos, esInterno, idProfesor  FROM externoCodirector INNER JOIN profesorYtesis WHERE idExternoCodirector = ${respColab[j].idProfesor} AND idProfesor=${respColab[j].idProfesor}`)
				}
				else {
					respNombres = await pool.query(`SELECT nombreProfesor, rol, pos, esInterno, profesores.idProfesor FROM profesores INNER JOIN profesorYtesis WHERE profesores.idProfesor=${respColab[j].idProfesor} AND profesorYtesis.idProfesor=${respColab[j].idProfesor}`)
				}
				aux.push(respNombres[0]);
			}
			resp[i].profesores = aux;
		}
		res.json(resp)
	}

	public async listTesistasByProfesorByPeriodoByInicio(req: Request, res: Response): Promise<void> {
		const { idProfesor, fechaIni, fechaFin } = req.params
		let respNombres: ''
		const resp = await pool.query(`SELECT DISTINCT t.* FROM tesistas AS t INNER JOIN profesorYtesis AS pyt INNER JOIN profesores AS p WHERE pyt.idProfesor=${idProfesor} AND t.idTesis=pyt.idTesis AND t.inicio >= '${fechaIni}' and t.inicio <= '${fechaFin}' ORDER BY t.inicio ASC`)
		for (var i = 0; i < resp.length; i++) {
			const respColab = await pool.query(`SELECT * FROM profesorYtesis where profesorYtesis.idTesis=${resp[i].idTesis} ORDER BY rol ASC`)
			let aux: any[] = []
			for (var j = 0; j < respColab.length; j++) {
				if (respColab[j].esInterno == 0) {
					respNombres = await pool.query(`SELECT PT.idProfesor, EC.nombreCodirector AS nombreProfesor, PT.rol, PT.pos, PT.esInterno FROM externoCodirector AS EC INNER JOIN profesorYtesis AS PT ON EC.idExternoCodirector=PT.idProfesor WHERE idExternoCodirector = ${respColab[j].idProfesor} AND PT.esInterno=0 AND PT.idTesis=${resp[i].idTesis}`)
				}
				else {
					respNombres = await pool.query(`SELECT PT.idProfesor, P.nombreProfesor AS nombreProfesor, PT.rol, PT.pos, PT.esInterno FROM profesores AS P INNER JOIN profesorYtesis AS PT ON P.idProfesor=PT.idProfesor WHERE P.idProfesor=${respColab[j].idProfesor} AND PT.esInterno=1 AND PT.idTesis=${resp[i].idTesis}`)
				}
				aux.push(respNombres[0]);
			}
			resp[i].profesores = aux;
		}
		res.json(resp)
	}

	public async listTesistasByProfesorByPeriodoByStatus(req: Request, res: Response): Promise<void> {
		const { idProfesor, fechaIni, fechaFin } = req.params
		let respNombres: ''
		let aux2: any[] = []
		const resp = await pool.query(`SELECT DISTINCT t.idTesis,t.nombreTesis,t.nombreEstudiante,t.nivel,t.matricula,t.status,t.inicio,t.fin,t.comprobante FROM tesistas AS t INNER JOIN profesorYtesis AS pyt INNER JOIN profesores AS p WHERE pyt.idProfesor=${idProfesor} AND t.idTesis=pyt.idTesis AND t.inicio >= '${fechaIni}' and t.inicio <= '${fechaFin}' ORDER BY t.status ASC`)
		for (var i = 0; i < resp.length; i++) {
			const respColab = await pool.query(`SELECT idProfesor,esInterno FROM profesorYtesis where profesorYtesis.idTesis=${resp[i].idTesis} ORDER BY rol ASC`)
			let aux: any[] = []
			for (var j = 0; j < respColab.length; j++) {
				if (respColab[j].esInterno == "0") {
					respNombres = await pool.query(`SELECT nombreCodirector AS nombreProfesor, rol, pos, esInterno FROM externoCodirector INNER JOIN profesorYtesis WHERE idExternoCodirector = ${respColab[j].idProfesor} AND idProfesor=${respColab[j].idProfesor}`)
				}
				else {
					respNombres = await pool.query(`SELECT profesores.idProfesor,nombreProfesor AS nombreProfesor,rol,esInterno,pos FROM profesores INNER JOIN profesorYtesis WHERE profesores.idProfesor=${respColab[j].idProfesor} AND profesorYtesis.idProfesor=${respColab[j].idProfesor}`)
				}
				aux.push(respNombres[0]);
			}
			resp[i].profesores = aux;
		}
		res.json(resp)
	}

	public async listTesistasByCarreraByPeriodo(req: Request, res: Response): Promise<void> {
		const { idCarrera, fechaIni, fechaFin } = req.params
		let respNombres: ''
		let aux2: any[] = []
		const resp = await pool.query(`SELECT DISTINCT t.* FROM tesistas AS t INNER JOIN profesorYtesis AS pyt INNER JOIN profesores AS p WHERE pyt.idProfesor=p.idProfesor AND t.idTesis=pyt.idTesis AND t.inicio >= '${fechaIni}' AND t.inicio <= '${fechaFin}' AND p.idCarrera = ${idCarrera} AND pyt.esInterno=1`)
		for (var i = 0; i < resp.length; i++) {
			const respColab = await pool.query(`SELECT idProfesor,esInterno FROM profesorYtesis where profesorYtesis.idTesis=${resp[i].idTesis} ORDER BY pos ASC`)
			let aux: any[] = []
			for (var j = 0; j < respColab.length; j++) {
				if (respColab[j].esInterno == "0") {
					respNombres = await pool.query(`SELECT nombreCodirector AS nombreProfesor, rol, pos, esInterno FROM externoCodirector INNER JOIN profesorYtesis WHERE idExternoCodirector = ${respColab[j].idProfesor} AND idProfesor=${respColab[j].idProfesor}`)
				}
				else {
					respNombres = await pool.query(`SELECT nombreProfesor, rol, pos, esInterno FROM profesores INNER JOIN profesorYtesis WHERE profesores.idProfesor=${respColab[j].idProfesor} AND profesorYtesis.idProfesor=${respColab[j].idProfesor}`)
				}
				aux.push(respNombres[0]);
			}
			resp[i].profesores = aux;
		}
		res.json(resp)
	}

	public async listCodirectoresExternosSugerencias(req: Request, res: Response): Promise<void> {
		//Soym eml Leom Memmsim deml bamckemnd ᕦ(ò_óˇ)ᕤ
		//metodo para obtener los coodirectores Externos que no han coincidido en alguna tesis con el el profesor obtenido a traves de su idProfesor
		const { idProfesor } = req.params
		const resp = await pool.query(`SELECT idExternoCodirector, nombreCodirector FROM externoCodirector where idExternoCodirector NOT IN (SELECT idProfesor FROM profesorytesis where idTesis IN (SELECT idTesis FROM profesorytesis where idProfesor=${idProfesor} and esInterno = 1) and esInterno = 0)`)
		res.json(resp)
	}

	public async listTesistasByProfesorByPeriodoByNombreTesis(req: Request, res: Response): Promise<void> {
		const { idProfesor, fechaIni, fechaFin } = req.params
		let respNombres: ''
		let aux2: any[] = []
		const resp = await pool.query(`SELECT DISTINCT t.idTesis,t.nombreTesis,t.nombreEstudiante,t.nivel,t.matricula,t.status,t.inicio,t.fin,t.comprobante FROM tesistas AS t INNER JOIN profesorYtesis AS pyt INNER JOIN profesores AS p WHERE pyt.idProfesor=${idProfesor} AND t.idTesis=pyt.idTesis AND t.inicio >= '${fechaIni}' and t.inicio <= '${fechaFin}' ORDER BY t.nombreTesis ASC`)
		for (var i = 0; i < resp.length; i++) {
			const respColab = await pool.query(`SELECT idProfesor,esInterno FROM profesorYtesis where profesorYtesis.idTesis=${resp[i].idTesis} ORDER BY rol ASC`)
			let aux: any[] = []
			for (var j = 0; j < respColab.length; j++) {
				if (respColab[j].esInterno == "0") {
					respNombres = await pool.query(`SELECT nombreCodirector AS nombreProfesor, rol, pos, esInterno FROM externoCodirector INNER JOIN profesorYtesis WHERE idExternoCodirector = ${respColab[j].idProfesor} AND idProfesor=${respColab[j].idProfesor}`)
				}
				else {
					respNombres = await pool.query(`SELECT nombreProfesor, rol, pos, esInterno FROM profesores INNER JOIN profesorYtesis WHERE profesores.idProfesor=${respColab[j].idProfesor} AND profesorYtesis.idProfesor=${respColab[j].idProfesor}`)
				}
				aux.push(respNombres[0]);
			}
			resp[i].profesores = aux;
		}
		res.json(resp)
	}

	public async listCodirectoresExternos(req: Request, res: Response): Promise<void> {
		const { idProfesor } = req.params;
		let consulta = `SELECT t1.idExternoCodirector, t1.nombreCodirector FROM externoCodirector as t1 LEFT OUTER JOIN (SELECT * FROM profesoryTesis as pyt INNER JOIN externoCodirector as eC ON pyt.idProfesor = eC.idExternoCodirector WHERE idTesis = ANY (SELECT idTesis from profesorYtesis WHERE idProfesor = ${idProfesor} AND esInterno = 1) AND esInterno = 0) as t2 on t1.idExternoCodirector = t2.idExternoCodirector WHERE t2.idExternoCodirector IS NULL`
		let resp = await pool.query(consulta);
		res.json(resp);
	}

	public async updatePrioridadesTestistas(req: Request, res: Response) {
		let respuesta;
		const { idTesis } = req.params;

		//Recorremos el body con los JSON de la consulta
		for (let i = 0; i < req.body.length; i++) {
			const elementoBody = req.body[i];
			//Actualizamos 
			respuesta = await pool.query('UPDATE profesorYTesis SET ? WHERE idTesis = ? AND idProfesor = ? AND esInterno = ?', [elementoBody, idTesis, elementoBody.idProfesor, elementoBody.esInterno]);
		}

		res.json(respuesta);
	}

	public async listNoColaboradoresUTMByCarreraByTesis(req: Request, res: Response) {
		const { idCarrera, idTesis } = req.params
		let respuesta: any = [];
		let idProfesores: any[] = [];

		let respuestaAutoresTesis = await pool.query(`SELECT P.idProfesor FROM profesores AS P INNER JOIN profesorytesis PT ON P.idProfesor = PT.idProfesor WHERE PT.idTesis = ? AND P.idCarrera = ? AND PT.esInterno = 1`, [idTesis, idCarrera]);

		//Pasamos los id a un arreglo
		respuestaAutoresTesis.forEach((element: any) => {
			idProfesores.push(element.idProfesor);
		});

		//Obtenemos los idProfesores de los profesores de la carrera dada
		let respuestaProfesores = await pool.query(`SELECT idProfesor, nombreProfesor FROM profesores WHERE idCarrera = ${idCarrera}`);

		//Recorremos los profesores de la carreara para filtrar por los colaboradores de la tesis
		for (let i = 0; i < respuestaProfesores.length; i++) {
			const element = respuestaProfesores[i];
			//Si no esta dentro de los id de los autores entonces añade al JSON de respuesta
			if (!idProfesores.includes(element.idProfesor)) {
				respuesta.push(element);
			}
		}

		res.json(respuesta);
	}

	public async addCodirectoresTesistaUTM(req: Request, res: Response): Promise<void> {
		let respuesta;
		const { idTesis } = req.params;

		//Recorremos el body con los JSON de la consulta
		for (let i = 0; i < req.body.length; i++) {
			const profesorYTesis = req.body[i];
			profesorYTesis.idTesis =idTesis;
			profesorYTesis.esInterno = 1;
			//Creamos 
			respuesta = await pool.query('INSERT INTO profesorYTesis SET ?', [profesorYTesis]);
		}
		res.json(respuesta);
	}

	public async listProfesoresbyInstitutoNoCodirectores(req: Request, res: Response) {
		const { idInstituto, idTesis } = req.params
		let respuesta: any = [];
		let profesores;
		let coodirectoresTesis;
		let coodirectores: any[] = [];
		coodirectoresTesis = await pool.query(`SELECT P.idProfesor,P.nombreProfesor,P.correo,P.nivel,P.idCarrera,P.grado,P.tipo,P.nombreApa,P.idInstituto FROM profesores AS P INNER JOIN profesorYtesis PT ON P.idProfesor = PT.idProfesor WHERE PT.idTesis = ${idTesis} AND P.idInstituto = ${idInstituto} AND PT.esInterno = 1 ORDER BY P.idProfesor`);
		coodirectoresTesis.forEach((element: any) => {
			coodirectores.push(element.idProfesor);
		});
		profesores = await pool.query(`SELECT DISTINCT * FROM profesores WHERE idInstituto = ${idInstituto} ORDER BY idProfesor`);
		for (let i = 0; i < profesores.length; i++) {
			const element = profesores[i];
			if (!coodirectores.includes(element.idProfesor)) {
				respuesta.push(element);
			}
		}
		res.json(respuesta);
	}

}

export const tesistasController = new TesistasController()