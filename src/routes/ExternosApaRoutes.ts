import { Router } from 'express'
import { externosApaController } from '../controllers/ExternosApaController'

class ExternosApaRouters {

	public router: Router = Router()

	constructor() {
		this.config()
	}

	config() : void {
		this.router.get('/', externosApaController.list)
		this.router.get('/:idExternoAPA', externosApaController.listOne);
		this.router.post('/create', externosApaController.create)
		this.router.delete('/delete/:idExternoAPA', externosApaController.delete)
		this.router.put('/update/:idExternoAPA', externosApaController.update)
	}
}

const externosApaRouters = new ExternosApaRouters()
export default externosApaRouters.router