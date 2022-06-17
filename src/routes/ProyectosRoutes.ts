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
		this.router.post('/create', proyectosController.create)
		this.router.delete('/delete/:idProyecto', proyectosController.delete)
		this.router.put('/update/:idProyecto', proyectosController.update)
		this.router.get('/listProyectosByProfesorByPeriodo/:idProfesor/:fechaIni/:fechaFin', proyectosController.listProyectosByProfesorByPeriodo);
		this.router.get('/listColaboradoresInternosProyectos/:idProfesor', proyectosController.listColaboradoresInternosProyectos)
	}

}

const proyectoRoutes = new ProyectoRoutes()
export default proyectoRoutes.router