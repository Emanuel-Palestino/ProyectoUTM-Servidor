import { Router } from 'express'
import { profesoresController } from '../controllers/ProfesoresController'

class ProfesoresRoutes {

	public router: Router = Router()

	constructor() {
		this.config()
	}

	config() : void {
		this.router.get('/', profesoresController.list)
		this.router.get('/listProfesorByInstituto', profesoresController.listProfesorByInstituto)
		this.router.get('/:id', profesoresController.listOne)
		this.router.post('/create', profesoresController.create)
		this.router.delete('/delete/:idProfesor', profesoresController.delete)
		this.router.put('/cambiarContrasena/:correo', profesoresController.cambiarContraseña)
		this.router.put('/update/:idProfesor', profesoresController.update)
		this.router.get('/profesoresByInstituto/:idInstituto', profesoresController.getProfesorByInstituto)
		this.router.get('/profesoresByCarrera/:idCarrera', profesoresController.getProfesorByCarrera)
		this.router.get('/profesoresByArticulo/:idArticulo', profesoresController.getProfesoresByArticulo)
		this.router.post('/autenticar', profesoresController.existe);
		this.router.put('/updateDatosPersonales/:idProfesor',profesoresController.updateDatosPersonales);
	}

}

const profesoresRoutes = new ProfesoresRoutes()
export default profesoresRoutes.router