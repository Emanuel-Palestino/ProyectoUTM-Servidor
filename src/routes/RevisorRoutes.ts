import { Router } from 'express'
import 	{ revisorController } from '../controllers/RevisorController'

class RevisorRoutes {

	public router: Router = Router()

	constructor() {
		this.config()
	}

	config() : void {
		this.router.get('/', revisorController.list)
		this.router.get('/:idRevisor', revisorController.listOne)
		this.router.post('/create', revisorController.create)
		this.router.delete('/delete/:idRevisor', revisorController.delete) 
		this.router.put('/update/:idRevisor', revisorController.update)
		this.router.get('/listRevisionByProfesor/:idProfesor/:fechaIni/:fechaFin', revisorController.listRevisionByProfesor);
	}

}

const revisorRoutes = new RevisorRoutes()
export default revisorRoutes.router