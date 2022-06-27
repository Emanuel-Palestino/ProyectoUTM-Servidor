import { Router } from 'express'
import { profesorYMateriaMultipleController } from '../controllers/ProfesorYMateriaMultipleController'

class ProfesorYMateriaMultipleRoutes {

	public router: Router = Router()

	constructor() {
		this.config()
	}

	config() : void {
		this.router.get('/', profesorYMateriaMultipleController.list)
		this.router.get('/:idProfesorYMateriaMultiple', profesorYMateriaMultipleController.listOne)
		this.router.post('/create', profesorYMateriaMultipleController.create)
		this.router.delete('/delete/:idProfesorYMateriaMultiple', profesorYMateriaMultipleController.delete) 
		this.router.put('/update/:idProfesorYMateriaMultiple', profesorYMateriaMultipleController.update)
	}

}

const profesorYMateriaMultipleRoutes = new ProfesorYMateriaMultipleRoutes()
export default profesorYMateriaMultipleRoutes.router