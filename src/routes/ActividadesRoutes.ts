import { Router } from 'express'
import { actividadesController } from '../controllers/ActividadesController'

class ActividadesRoutes {

	public router: Router = Router()

	constructor() {
		this.config()
	}

	config() : void {
		this.router.get('/', actividadesController.list)
		this.router.get('/:id', actividadesController.listOne)
		this.router.post('/create', actividadesController.create)
		this.router.delete('/delete/:idArticulo', actividadesController.delete) 
		this.router.put('/update/:idArticulo', actividadesController.update)
		this.router.get('/actividadesByProfesor/:idProfesor/:fechaIni/:fechaFin', actividadesController.getActividadesByProfesor)
		this.router.get('/actividadesByInstituto/:idInstituto/:fechaIni/:fechaFin', actividadesController.getActividadesByInstituto)
		this.router.get('/actividadesByCarrera/:idCarrera/:fechaIni/:fechaFin', actividadesController.getActividadesByCarrera)
	}

}

const actividadesRoutes = new ActividadesRoutes()
export default actividadesRoutes.router