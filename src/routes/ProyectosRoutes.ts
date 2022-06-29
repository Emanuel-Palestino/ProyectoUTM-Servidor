import { Router } from 'express'
import { proyectosController } from '../controllers/ProyectosController'

class ProyectoRoutes {

	public router: Router = Router()

	constructor() {
		this.config()
	}

	config() : void {
		this.router.get('/', proyectosController.list)
		this.router.get('/:idProyecto', proyectosController.listOne)
		this.router.post('/create/:idProfesor', proyectosController.create)
		this.router.get('/listSugerenciasColaboradoresExternosProyectos/:idProfesor', proyectosController.listColaboradoresExternosProyectos)
		this.router.get('/listColaboradoresExternosSinColaboracionProyectos/:idProfesor', proyectosController.listColaboradoresExternosSinColaboracionProyectos)
		this.router.delete('/delete/:idProyecto', proyectosController.delete)
		this.router.put('/update/:idProyecto', proyectosController.update)
		this.router.get('/listProyectosByProfesorByPeriodo/:idProfesor/:fechaIni/:fechaFin', proyectosController.listProyectosByProfesorByPeriodo);
		this.router.get('/listProfesoresByInstitutoSinColaboradoresInternosByProyecto/:idProyecto/:idInstituto', proyectosController.listProfesoresByInstitutoSinColaboradoresInternosByProyecto)
		this.router.get('/listProyectosByCarreraByPeriodo/:idCarrera/:fechaIni/:fechaFin', proyectosController.listProyectosByCarreraByPeriodo)
		this.router.get('/listColaboradoresInternosProyectos/:idProfesor', proyectosController.listColaboradoresInternosProyectos)
		this.router.put('/updatePrioridadesOfColaboradoresByProyecto/:idProyecto', proyectosController.updatePrioridadesOfColaboradoresByProyecto)
		this.router.get('/listColaboradoresInternosProyectos/:idProfesor', proyectosController.listColaboradoresInternosProyectos);
		this.router.post('/createColaboradorExternoProyecto/:idProyecto', proyectosController.createColaboradorExternoProyecto);
		this.router.post('/addColaboradoresProyectoUTM/:idProyec', proyectosController.addColaboradoresProyectoUTM);		
	}

}

const proyectoRoutes = new ProyectoRoutes()
export default proyectoRoutes.router