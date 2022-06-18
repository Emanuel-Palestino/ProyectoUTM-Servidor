import { Router } from 'express'
import { profesorYComisionController } from '../controllers/ProfesorYComisionController'

class ProfesorYComisionRoutes {

	public router: Router = Router()

	constructor() {
		this.config()
	}

	config() : void {
		this.router.get('/', profesorYComisionController.list)
		this.router.post('/AddComisionado/:idComision', profesorYComisionController.AddComisionado)
		this.router.get('/:idProfesor/:idComision', profesorYComisionController.listOne)
		this.router.post('/create', profesorYComisionController.create)
		this.router.delete('/delete/:idProfesor/:idComision', profesorYComisionController.delete)
		this.router.put('/update/:idProfesor/:idComision', profesorYComisionController.update)
	}
}

const profesorYComisionRoutes = new ProfesorYComisionRoutes();
export default profesorYComisionRoutes.router;