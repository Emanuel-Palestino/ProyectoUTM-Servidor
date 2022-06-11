import { Router } from 'express'
import 	{ revisorController } from '../controllers/RevisorController'

class RevisorRoutes {

	public router: Router = Router()

	constructor() {
		this.config()
	}

	config() : void {
		this.router.get('/', revisorController.list)
		this.router.get('/:id', revisorController.listOne)
		this.router.post('/create/:idProfesor', revisorController.create)
		this.router.delete('/delete/:idArticulo', revisorController.delete) 
		this.router.put('/update/:idArticulo', revisorController.update)
	}

}

const revisorRoutes = new RevisorRoutes()
export default revisorRoutes.router