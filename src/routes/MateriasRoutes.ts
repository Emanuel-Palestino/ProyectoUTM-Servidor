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
        this.router.delete('/delete/:idMateria',materiasController.delete);
        this.router.get('/listMateriasByCarreraByPeriodo/:idCarrera/:idPeriodo',materiasController.listMateriasByCarreraByPeriodo);
        this.router.get('/listMateriasByAnyoByPeriodo/:idProfesor/:anyoIni/:anyoFin',materiasController.listMateriasByAnyoByPeriodo);
        this.router.get('/listMateriasByAnyoByPeriodoMultiple/:idProfesor/:anyoIni/:anyoFin',materiasController.listMateriasByAnyoByPeriodoMultiple);
        this.router.get('/listMateriasMultiasignacionByPeriodoByProfesor/:idPeriodo/:idProfesor',materiasController.listMateriasMultiasignacionByPeriodoByProfesor);
        }
}
const materiasRouter = new MateriasRouter()
export default materiasRouter.router