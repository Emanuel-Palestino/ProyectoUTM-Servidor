import { Router } from 'express'
import 	{ carrerasController } from '../controllers/CarrerasController'

class CarrerasRouter {

	public router: Router = Router()

	constructor() {
		this.config()
	}

	config() : void {
		this.router.get('/', carrerasController.list)
		this.router.get('/:idCarrera', carrerasController.listOne);
		this.router.post('/create', carrerasController.create)
		this.router.delete('/delete/:idCarrera', carrerasController.delete)
		this.router.put('/update/:idCarrera', carrerasController.update)
		this.router.get('/getCarrerasByInstituto/:idInstituto', carrerasController.getCarrerasByInstituto);
	}
}

const carrerasRouter = new CarrerasRouter()
export default carrerasRouter.router