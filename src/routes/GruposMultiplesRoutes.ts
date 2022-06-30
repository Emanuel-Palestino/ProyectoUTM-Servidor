import { Router } from 'express'
import 	{ gruposMultiplesController } from '../controllers/GruposMultiplesController'

class GruposMultiplesRoutes {

	public router: Router = Router()

	constructor() {
		this.config()
	}

	config() : void {
		this.router.get('/', gruposMultiplesController.list)
		this.router.post('/create', gruposMultiplesController.create)
		this.router.delete('/delete/:idCarrera', gruposMultiplesController.delete)
	}
}

const gruposMultiplesRoutes = new GruposMultiplesRoutes()
export default gruposMultiplesRoutes.router