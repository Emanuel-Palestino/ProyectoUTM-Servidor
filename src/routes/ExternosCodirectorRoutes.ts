import { Router } from 'express';
import { externosCodirectorController } from '../controllers/ExternosCodirectorController';

class ExternosCodirectorRoutes{
	public router: Router=Router();
	constructor()
	{
		this.config();
	}
	config() : void
	{
		this.router.post('/create', externosCodirectorController.create);
		this.router.get('/',externosCodirectorController.list );
		this.router.get('/:idExternoCodirector',externosCodirectorController.listOne);
		this.router.put('/update/:idExternoCodirector',externosCodirectorController.actualizar);
		this.router.delete('/delete/:idExternoCodirector', externosCodirectorController.delete);
	}
}
const externosCodirectorRoutes= new ExternosCodirectorRoutes();
export default externosCodirectorRoutes.router;