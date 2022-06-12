import { Router } from 'express'
import { profesorYProyectoController } from '../controllers/ProfesorYProyectoController'

class ProfesorYProyecto {

	public router: Router = Router()

	constructor() {
		this.config()
	}

	config() : void {
		this.router.get('/', profesorYProyectoController.list)
		this.router.get('/:idProyecto/:idProfesor', profesorYProyectoController.listOne)
		this.router.post('/create', profesorYProyectoController.create)
		this.router.delete('/delete/:idProyecto/:idProfesor', profesorYProyectoController.delete)
		this.router.put('/update/:idProyecto/:idProfesor', profesorYProyectoController.update)
	}

}

const profesorYProyectoRoutes = new ProfesorYProyecto()
export default profesorYProyectoRoutes.router