import { Router } from 'express'
import { externosProyectoController } from '../controllers/ExternosProyectoController'

class ExternosProyectoRoutes {

	public router: Router = Router()

	constructor() {
		this.config()
	}

	config() : void {
		this.router.get('/', externosProyectoController.list)
		this.router.get('/:idExterno', externosProyectoController.listOne)
		this.router.post('/create', externosProyectoController.create)
		this.router.delete('/delete/:idExterno', externosProyectoController.delete)
		this.router.put('/update/:idExterno', externosProyectoController.update)
	}

}

const externosProyectoRoutes = new ExternosProyectoRoutes()
export default externosProyectoRoutes.router