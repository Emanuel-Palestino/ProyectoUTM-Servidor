import { Router } from 'express'
import { profesorYMateriaController } from '../controllers/ProfesorYMateriaController'

class ProfesorYMateriaRoutes {

	public router: Router = Router()

	constructor() {
		this.config()
	}

	config() : void {
		this.router.get('/', profesorYMateriaController.list)
		this.router.get('/:idProfesorYMateria', profesorYMateriaController.listOne)
		this.router.post('/create', profesorYMateriaController.create)
		this.router.delete('/delete/:idProfesorYMateria', profesorYMateriaController.delete) 
		this.router.put('/update/:idProfesorYMateria', profesorYMateriaController.update)
	}

}

const profesorYMateriaRoutes = new ProfesorYMateriaRoutes()
export default profesorYMateriaRoutes.router