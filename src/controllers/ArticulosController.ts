import { Request, Response } from 'express';
import pool from '../database'

class ArticulosController {

	public async list(req: Request, res: Response): Promise<void> {
		const respuesta = await pool.query('SELECT * FROM articulos order by idArticulo')
		res.json(respuesta)
	}

	public async listOne(req: Request, res: Response): Promise<void> {
		const { id } = req.params;
		const respuesta = await pool.query('SELECT * FROM articulos WHERE idArticulo = ?', [id])
		if (respuesta.length > 0) {
			res.json(respuesta[0])
			return;
		}
		res.status(404).json({ 'mensaje': 'Articulo no encontrado' })
	}

	public async create(req:Request, res: Response): Promise<void> {
		const { idProfesor, fecha } = req.params
		const resp = await pool.query('INSERT INTO articulos SET ?', [req.body])
		let dato = {
			idProfesor: idProfesor,
			idArticulo: resp.insertId,
			pos: 1,
			validado: 1,
			fechaModificacion: fecha,
			esInterno: 1
		}
		const resp2 = await pool.query('INSERT INTO profesorYarticulo SET ?', dato)
		res.json(resp2)
	}

	public async delete(req:Request, res: Response): Promise<void> {
		const { idArticulo } = req.params
		let resp = await pool.query(`DELETE FROM profesorYarticulo WHERE idArticulo=${idArticulo}`)
		resp = await pool.query(`DELETE FROM articulos WHERE idArticulo=${idArticulo}`)
		res.json(resp)
	}

	public async update(req: Request, res: Response): Promise<void> {
		const { idArticulo } = req.params
		const resp = await pool.query('UPDATE articulos set ? WHERE idArticulo=?', [req.body, idArticulo])
		res.json(resp)
	}

	public async listArticulosByProfesorByPeriodo(req: Request, res: Response): Promise<void> {
		const { idProfesor, fechaIni, fechaFin } = req.params
		let respuestaAutores: '';
		let respuesta = await pool.query(`SELECT A.idArticulo, A.tipoCRL, A.titulo, A.fechaedicion, A.estado, A.anyo FROM articulos as A INNER JOIN profesorYarticulo PA ON PA.idArticulo=A.idArticulo WHERE PA.idProfesor=${idProfesor} AND fechaedicion >= '${fechaIni}' AND fechaedicion <= '${fechaFin}'`)
		
		// Obtener los profesores participantes
		for (let i = 0; i < respuesta.length; i++) {
			//Obtenemos los autores del articulo
			const respuestaProfesores = await pool.query('SELECT PA.* FROM profesorYarticulo AS PA WHERE PA.idArticulo = ? ORDER BY PA.pos',respuesta[i].idArticulo);
			let aux: any[] = [];		//Usamos un arreglo auxiliar para meter los autores 

			for(let j = 0; j < respuestaProfesores.length ; j++){

				if(respuestaProfesores[j].esInterno == 1){
					 respuestaAutores = await pool.query(`SELECT P.idProfesor, P.nombreProfesor, P.nombreApa, PA.pos, PA.validado, PA.fechaModificacion, PA.esInterno FROM profesores as P INNER JOIN profesorYarticulo PA ON PA.idProfesor = P.idProfesor WHERE PA.idArticulo = ${respuesta[i].idArticulo} AND PA.idProfesor = ${respuestaProfesores[j].idProfesor}`);
				}else{
				 	 respuestaAutores = await pool.query(`SELECT PA.idProfesor, EA.nombre AS nombreProfesor, EA.nombreAPA AS nombreApa, PA.pos, PA.validado, PA.fechaModificacion, PA.esInterno FROM externosAPA as EA INNER JOIN profesorYarticulo PA ON PA.idProfesor = EA.idExternoAPA WHERE PA.idProfesor = '${respuestaProfesores[j].idProfesor}' AND PA.idArticulo = '${respuesta[i].idArticulo}'`);
				}
				aux.push(respuestaAutores[0]);
			}
			respuesta[i].autores = aux;
		}

		res.json(respuesta)
	}

	public async getArticulosByInstituto(req: Request, res: Response): Promise<void> {
		const { idInstituto } = req.params
		let respuesta = await pool.query(`SELECT A.* FROM articulos as A INNER JOIN profesorYarticulo PA ON PA.idArticulo=A.idArticulo INNER JOIN profesores P ON P.idProfesor=PA.idProfesor WHERE P.idInstituto=${idInstituto}`)
		// Obtener los profesores participantes y archivos subidos
		for (let i = 0; i < respuesta.length; i++) {
			const respuesta2 = await pool.query('SELECT P.idProfesor, P.nombreProfesor, P.nombreApa, PA.pos FROM profesores as P INNER JOIN profesorYarticulo PA ON PA.idProfesor=P.idProfesor WHERE PA.idArticulo=? ORDER BY PA.pos', respuesta[i].idArticulo)
			respuesta[i].autores = respuesta2
		}

		res.json(respuesta)
	}

	public async getArticulosByInstitutoByFecha(req: Request, res: Response): Promise<void> {
		const { idInstituto, fechaIni, fechaFin } = req.params
		let respuesta = await pool.query(`SELECT A.* FROM articulos as A INNER JOIN profesorYarticulo PA ON PA.idArticulo=A.idArticulo INNER JOIN profesores P ON P.idProfesor=PA.idProfesor WHERE P.idInstituto=${idInstituto} AND fechaedicion >= '${fechaIni}' AND fechaedicion <= '${fechaFin}'`)
		
		// Obtener los profesores participantes
		for (let i = 0; i < respuesta.length; i++) {
			const respuesta2 = await pool.query('SELECT P.idProfesor, P.nombreProfesor, P.nombreApa, PA.pos FROM profesores as P INNER JOIN profesorYarticulo PA ON PA.idProfesor=P.idProfesor WHERE PA.idArticulo=? ORDER BY PA.pos', respuesta[i].idArticulo)
			respuesta[i].autores = respuesta2
		}

		res.json(respuesta)
	}


	public async getTodoPorInsituto(req: Request, res: Response): Promise<void> {
		const { idInstituto, fechaIni, fechaFin } = req.params
		let respuesta = await pool.query(`SELECT A.* FROM articulos as A INNER JOIN profesorYarticulo PA ON PA.idArticulo=A.idArticulo INNER JOIN profesores P ON P.idProfesor=PA.idProfesor WHERE PA.pos=1 AND P.idInstituto=${idInstituto} AND fechaedicion >= '${fechaIni}' AND fechaedicion <= '${fechaFin}'`)
		// Obtener los profesores participantes
		for (let i = 0; i < respuesta.length; i++) {
			const respuesta2 = await pool.query('SELECT P.idProfesor, P.nombreProfesor, P.nombreApa, PA.pos FROM profesores as P INNER JOIN profesorYarticulo PA ON PA.idProfesor=P.idProfesor WHERE PA.idArticulo=? ORDER BY PA.pos', respuesta[i].idArticulo)
			respuesta[i].autores = respuesta2
		}

		res.json(respuesta)
	}
	
	public async getTodoDivididoInstituto(req: Request, res: Response): Promise<void> {
		let respuesta = await pool.query(`SELECT A.*, I.nombreInstituto FROM articulos as A INNER JOIN profesorYarticulo PA ON PA.idArticulo=A.idArticulo INNER JOIN profesores P ON P.idProfesor=PA.idProfesor AND PA.pos=1 INNER JOIN institutos I ON P.idInstituto=I.idInstituto WHERE I.idInstituto > 0 ORDER BY I.idInstituto;`)
		// Obtener los profesores participantes
		for (let i = 0; i < respuesta.length; i++) {
			const respuesta2 = await pool.query('SELECT P.idProfesor, P.nombreProfesor, P.nombreApa, PA.pos FROM profesores as P INNER JOIN profesorYarticulo PA ON PA.idProfesor=P.idProfesor WHERE PA.idArticulo=? ORDER BY PA.pos', respuesta[i].idArticulo)
			respuesta[i].autores = respuesta2
		}

		res.json(respuesta)
	}

	public async getTodoDivididoInstitutoPorFecha(req: Request, res: Response): Promise<void> {
		const { fechaIni, fechaFin } = req.params
		let respuesta = await pool.query(`SELECT A.*, I.nombreInstituto FROM articulos as A INNER JOIN profesorYarticulo PA ON PA.idArticulo=A.idArticulo INNER JOIN profesores P ON P.idProfesor=PA.idProfesor AND PA.pos=1 INNER JOIN institutos I ON P.idInstituto=I.idInstituto WHERE I.idInstituto > 0 AND A.fechaedicion>='${fechaIni}' AND A.fechaedicion<='${fechaFin}' ORDER BY I.idInstituto;`)
		// Obtener los profesores participantes
		for (let i = 0; i < respuesta.length; i++) {
			const respuesta2 = await pool.query('SELECT P.idProfesor, P.nombreProfesor, P.nombreApa, PA.pos FROM profesores as P INNER JOIN profesorYarticulo PA ON PA.idProfesor=P.idProfesor WHERE PA.idArticulo=? ORDER BY PA.pos', respuesta[i].idArticulo)
			respuesta[i].autores = respuesta2
		}

		res.json(respuesta)
	
	}

	public async listByPeriodo(req: Request, res: Response): Promise<void> {
		const { fechaIni, fechaFin } = req.params;
		const respuesta = await pool.query(`SELECT * FROM articulos WHERE fechaedicion >= "${fechaIni}" AND fechaedicion <= "${fechaFin}"`)
		if (respuesta.length > 0) {
			console.log(respuesta.length)
			res.json(respuesta)
			return;
		}
		res.json({ 'mensaje': 'Articulos no encontrados' })
	}

	public async getSugerenciasExternoByAutorUTM(req:Request, res: Response): Promise<void>{
		const {idProfesor} = req.params;
		let listexternos = await pool.query(`SELECT DISTINCT EA.* FROM externosAPA AS EA INNER JOIN profesorYarticulo PAE ON EA.idExternoAPA = PAE.idProfesor INNER JOIN profesorYarticulo PAO ON PAE.idArticulo = PAO.idArticulo WHERE PAE.esInterno = 0 AND PAO.esInterno!=0 AND PAO.idProfesor = ${idProfesor}`);
		res.json(listexternos);
	}

	public async addAutorExterno(req: Request, res: Response): Promise<void> {
		const {idArticulo,fecha} = req.params
		let profesor = req.body
		
		let resp = await pool.query(`INSERT INTO profesorYarticulo (idProfesor, idArticulo, pos, validado, fechaModificacion, esInterno) VALUES ('${profesor.idExternoAPA}','${idArticulo}', '${profesor.pos}','1', '${fecha}', '0')`)

		res.json(resp)
	}

    public async listAutoresExternosExistentesSinColaboracionArticulos(req: Request, res: Response): Promise<void> {
        const {idProfesor} = req.params
        let consulta = `SELECT t1.idExternoAPA, t1.nombreAPA, t1.correo, t1.nombre FROM externosAPA as t1 LEFT OUTER JOIN (SELECT * FROM profesorYarticulo as pya INNER JOIN externosAPA as eapa ON pya.idProfesor = eapa.idExternoAPA WHERE idArticulo = ANY (SELECT idArticulo from profesorYarticulo WHERE idProfesor = ${idProfesor} AND esInterno = 1) AND esInterno = 0) as t2 on t1.idExternoAPA = t2.idExternoAPA WHERE t2.idExternoAPA IS NULL`
        let resp = await pool.query(consulta)
        res.json(resp);
    }

	//listArticulosByProfesorByPeriodoByEstado
	
	public async listArticulosByProfesorByPeriodoByEstado(req: Request, res: Response): Promise<void>{
		console.log('hola');
		const {idProfesor, fechaIni, fechaFin} = req.params
		let respNombres: ''
		let aux2: any[] = []
		const resp = await pool.query(`SELECT DISTINCT t.* FROM Articulos AS t INNER JOIN profesorYarticulo AS pyt INNER JOIN profesores AS p WHERE pyt.idProfesor=${idProfesor} AND t.idArticulo=pyt.idArticulo AND t.fechaedicion >= '${fechaIni}' and t.fechaedicion <= '${fechaFin}' AND pyt.esInterno=1 ORDER BY t.estado`)
		for(var i=0; i<resp.length;i++){
			const respColab = await pool.query(`SELECT idProfesor,esInterno FROM profesorYarticulo where profesorYarticulo.idArticulo=${resp[i].idArticulo} ORDER BY pos ASC`)
			console.log(respColab);
			let aux: any[] = []
			for(var j=0; j<respColab.length;j++){
				if (respColab[j].esInterno == "0"){
					respNombres = await pool.query(`SELECT nombre AS nombreProfesor, nombreAPA,idExternoApa AS idProfesor, esInterno,pos FROM externosAPA INNER JOIN profesorYarticulo AS pya WHERE idProfesor = ${respColab[j].idProfesor} AND pya.idProfesor=${respColab[j].idProfesor} AND pya.idArticulo = ${resp[i].idArticulo}`)
				}
				else{
					respNombres =  await pool.query(`SELECT nombreProfesor, nombreAPA, p.idProfesor, esInterno,pos FROM profesores AS p INNER JOIN profesorYarticulo AS pya WHERE p.idProfesor=${respColab[j].idProfesor} AND pya.idProfesor=${respColab[j].idProfesor} AND pya.idArticulo = ${resp[i].idArticulo}`)
				}
				aux.push(respNombres[0]);
			}
			resp[i].profesores = aux;
		}
		console.log(aux2)
		//console.log(aux)
		res.json(resp)
	}

}

export const articulosController = new ArticulosController()