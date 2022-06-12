import { Router } from 'express'
import { materiasController } from '../controllers/MateriasController'

class MateriasRouter {

	public router: Router = Router()

	constructor() {
		this.config()
	}

	config() : void {
        this.router.post('/create',materiasController.create);
        this.router.get('/:idMateria',materiasController.listOne);
        this.router.get('/',materiasController.list);
        this.router.put('/update/:idMateria',materiasController.update);
        this.router.get('/delete/:idMateria',materiasController.delete);
	}
}
const materiasRouter = new MateriasRouter()
export default materiasRouter.router