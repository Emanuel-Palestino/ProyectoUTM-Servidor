import { Router } from 'express'
import 	{ articulosController } from '../controllers/ArticulosController'

class ArticulosRoutes {

	public router: Router = Router()

	constructor() {
		this.config()
	}

	config() : void {
		this.router.get('/', articulosController.list)
		this.router.get('/todoDividido', articulosController.getTodoDivididoInstituto)
		this.router.get('/:id', articulosController.listOne)
		this.router.post('/create/:idProfesor', articulosController.create)
		this.router.delete('/delete/:idArticulo', articulosController.delete) 
		this.router.put('/update/:idArticulo', articulosController.update)
		this.router.get('/articulosByInstituto/:idInstituto', articulosController.getArticulosByInstituto)
		this.router.get('/:fechaIni/:fechaFin', articulosController.listByPeriodo)
		this.router.get('/articulosByInstituto/:idInstituto/:fechaIni/:fechaFin', articulosController.getArticulosByInstitutoByFecha)
		this.router.get('/articulosByProfesor/:idProfesor/:fechaIni/:fechaFin', articulosController.getArticulosByProfesor)
		this.router.get('/todoByInstituto/:idInstituto/:fechaIni/:fechaFin', articulosController.getTodoPorInsituto)
		this.router.get('/todoDividido/:fechaIni/:fechaFin', articulosController.getTodoDivididoInstitutoPorFecha)
	}

}

const articulosRoutes = new ArticulosRoutes()
export default articulosRoutes.router