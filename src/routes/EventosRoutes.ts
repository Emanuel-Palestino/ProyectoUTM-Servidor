import { Router } from 'express'
import { eventosController } from '../controllers/EventosController'

class EventosRoutes {

	public router: Router = Router()

	constructor() {
		this.config()
	}

	config() : void {
		this.router.get('/listEventosByPeriodo/:idProfesor/:fechaIni/:fechaFin', eventosController.listEventosByPeriodo)
		this.router.get('/', eventosController.list)
		this.router.get('/:id', eventosController.listOne)
		this.router.post('/create', eventosController.create)
		this.router.delete('/delete/:idEvento', eventosController.delete) 
		this.router.put('/update/:idEvento', eventosController.update)
		this.router.get('/eventosByProfesor/:idProfesor/:fechaIni/:fechaFin', eventosController.getEventosByProfesor)
		this.router.get('/eventosByInstituto/:idInstituto/:fechaIni/:fechaFin', eventosController.getEventosByInstituto)
		this.router.get('/eventosByCarrera/:idCarrera/:fechaIni/:fechaFin', eventosController.getEventosByCarrera)
	}

}

const eventosRoutes = new EventosRoutes()
export default eventosRoutes.router