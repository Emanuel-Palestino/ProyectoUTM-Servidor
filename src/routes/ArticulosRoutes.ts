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
		this.router.get('/listAutoresExternosExistentesSinColaboracionArticulos/:idProfesor', articulosController.listAutoresExternosExistentesSinColaboracionArticulos)
		this.router.post('/create/:idProfesor/:fecha', articulosController.create)
		this.router.delete('/delete/:idArticulo', articulosController.delete) 
		this.router.put('/update/:idArticulo', articulosController.update)
		this.router.get('/articulosByInstituto/:idInstituto', articulosController.getArticulosByInstituto)
		this.router.get('/getSugerenciasExternoByAutorUTM/:idProfesor',articulosController.getSugerenciasExternoByAutorUTM);
		this.router.post('/addAutorExterno/:idArticulo/:fecha',articulosController.addAutorExterno);
		this.router.get('/listArticulosByProfesorByPeriodoByAnyo/:idProfesor/:fechaIni/:fechaFin',articulosController.listArticulosByProfesorByPeriodoByAnyo);
		this.router.get('/:fechaIni/:fechaFin', articulosController.listByPeriodo)
		this.router.get('/articulosByInstituto/:idInstituto/:fechaIni/:fechaFin', articulosController.getArticulosByInstitutoByFecha)
		this.router.get('/listArticulosByCarreraByPeriodo/:idCarrera/:fechaIni/:fechaFin', articulosController.listArticulosByCarreraByPeriodo)
		this.router.get('/listArticulosByProfesorByPeriodo/:idProfesor/:fechaIni/:fechaFin', articulosController.listArticulosByProfesorByPeriodo)
		this.router.get('/listArticulosByCarreraBytipo/:idProfesor/:fechaIni/:fechaFin/:tipo', articulosController.listArticulosByCarreraBytipo)
		this.router.get('/listArticulosByProfesorByPeriodoByEstado/:idProfesor/:fechaIni/:fechaFin',articulosController.listArticulosByProfesorByPeriodoByEstado);
		this.router.get('/todoByInstituto/:idInstituto/:fechaIni/:fechaFin', articulosController.getTodoPorInsituto)
		this.router.get('/todoDividido/:fechaIni/:fechaFin', articulosController.getTodoDivididoInstitutoPorFecha)
		this.router.get('/listArticulosByProfesorByPeriodoByTitulo/:idProfesor/:fechaIni/:fechaFin', articulosController.listArticulosByProfesorByPeriodoByTitulo)
		this.router.get('/listProfesoresByInstitutoNoAutores/:idInstituto/:idArticulo', articulosController.listProfesoresByInstitutoNoAutores);
	}

}

const articulosRoutes = new ArticulosRoutes()
export default articulosRoutes.router