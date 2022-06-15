import { Router } from 'express'
import 	{ profesorYArticuloController } from '../controllers/ProfesorYArticuloController'

class ProfesorYArticuloRoutes {

	public router: Router = Router()

	constructor() {
		this.config()
	}

	config() : void {
		this.router.get('/', profesorYArticuloController.list)
		this.router.get('/:id', profesorYArticuloController.listOne)
		this.router.post('/create', profesorYArticuloController.create)
		this.router.delete('/delete/:idArticuloYProfesor', profesorYArticuloController.delete)
		this.router.put('/update/:idArticuloYProfesor', profesorYArticuloController.update)
		this.router.get('/profesoresByArticulo/:idArticulo', profesorYArticuloController.profesoresByArticulo)
		this.router.get('/articulosByCarrera/:idCarrera', profesorYArticuloController.articulosByCarrera)
		this.router.post('/createExterno/:idArticulo/:pos', profesorYArticuloController.createExterno)
		this.router.post('/addAutoresUTM/:idArticulo/',profesorYArticuloController.addAutoresUTM)
	}

}

const profesorYArticuloRoutes = new ProfesorYArticuloRoutes()
export default profesorYArticuloRoutes.router