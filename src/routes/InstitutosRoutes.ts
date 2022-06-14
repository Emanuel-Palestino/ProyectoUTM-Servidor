import { Router } from 'express'
import 	{ institutosController } from '../controllers/InstitutosController'

class InstitutosRoutes {

	public router: Router = Router()

	constructor() {
		this.config()
	}

	config() : void {
		this.router.get('/', institutosController.list)
		this.router.get('/:idInstituto', institutosController.listOne)
		this.router.post('/create', institutosController.create)
		this.router.delete('/delete/:idInstituto', institutosController.delete)
		this.router.put('/update/:idInstituto', institutosController.update)
	}

}

const institutosRoutes = new InstitutosRoutes()
export default institutosRoutes.router