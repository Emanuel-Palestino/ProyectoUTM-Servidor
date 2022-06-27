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
		this.router.delete('/delete/:idArticulo/:idProfesor/:esInterno', profesorYArticuloController.delete)
		this.router.put('/update/:idArticuloYProfesor', profesorYArticuloController.update)
		this.router.get('/profesoresByArticulo/:idArticulo', profesorYArticuloController.profesoresByArticulo)
		this.router.get('/articulosByCarrera/:idCarrera', profesorYArticuloController.articulosByCarrera)
		this.router.post('/createExterno/:idArticulo/:pos', profesorYArticuloController.createExterno)
		this.router.post('/addAutoresUTM/:idArticulo/',profesorYArticuloController.addAutoresUTM)
		this.router.put('/updatePrioridadesOfAutoresByPublicacion/:idArticulo', profesorYArticuloController.updatePrioridadesOfAutoresByPublicacion)
		this.router.get('/listProfesorYArticulo/:idArticulo', profesorYArticuloController.listProfesorYArticulo)
	}

}

const profesorYArticuloRoutes = new ProfesorYArticuloRoutes()
export default profesorYArticuloRoutes.router