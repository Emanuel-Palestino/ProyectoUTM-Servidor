import { Router } from 'express'
import { archivoYArticuloController } from '../controllers/ArchivoYArticuloController'

class ArchivoYArticuloRoutes {

	public router: Router = Router()

	constructor() {
		this.config()
	}

	config() : void {
		this.router.get('/:idArticulo', archivoYArticuloController.archivosPorArticulo)
	}

}

const archivoYArticuloRoutes = new ArchivoYArticuloRoutes()
export default archivoYArticuloRoutes.router