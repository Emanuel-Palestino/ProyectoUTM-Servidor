import { Router } from 'express'
import { comisionesController } from '../controllers/ComisionesController';

class ComisionesRoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config() : void {
        this.router.get('/listarComisionesSinAsignar',comisionesController.listarComisionesSinAsignar);
        this.router.get('/', comisionesController.list);
        this.router.get('/:idComision', comisionesController.listOne);
        this.router.post('/create', comisionesController.create);
        this.router.put('/update/:idComision', comisionesController.update);
        this.router.delete('/delete/:idComision', comisionesController.delete);
        this.router.get('/listComisionesByProfesorByPeriodo/:idProfesor/:fechaIni/:fechaFin',comisionesController.listComisionesByProfesoByPeriodo);
        this.router.get('/listComisionesByCarreraByPeriodo/:idCarrera/:fechaIni/:fechaFin',comisionesController.listComisionesByCarreraByPeriodo);   
    }
}

const comisionesRoutes = new ComisionesRoutes();
export default comisionesRoutes.router;