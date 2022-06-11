"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./swagger.json"));
const IndexRoutes_1 = __importDefault(require("./routes/IndexRoutes"));
const CarrerasRoutes_1 = __importDefault(require("./routes/CarrerasRoutes"));
const InstitutosRoutes_1 = __importDefault(require("./routes/InstitutosRoutes"));
const ProfesoresRoutes_1 = __importDefault(require("./routes/ProfesoresRoutes"));
const ProfesorYArticuloRoutes_1 = __importDefault(require("./routes/ProfesorYArticuloRoutes"));
const ArticulosRoutes_1 = __importDefault(require("./routes/ArticulosRoutes"));
const ArchivoYArticuloRoutes_1 = __importDefault(require("./routes/ArchivoYArticuloRoutes"));
const EventosRoutes_1 = __importDefault(require("./routes/EventosRoutes"));
const ActividadesRoutes_1 = __importDefault(require("./routes/ActividadesRoutes"));
const ComisionesRoutes_1 = __importDefault(require("./routes/ComisionesRoutes"));
const ProfesorYComisionRoutes_1 = __importDefault(require("./routes/ProfesorYComisionRoutes"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
        this.app.use('/api/documentacion', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
        this.app.use(express_1.default.static(__dirname));
    }
    config() {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use(IndexRoutes_1.default);
        this.app.use('/api/carreras', CarrerasRoutes_1.default);
        this.app.use('/api/institutos', InstitutosRoutes_1.default);
        this.app.use('/api/profesores', ProfesoresRoutes_1.default);
        this.app.use('/api/profesorYArticulo', ProfesorYArticuloRoutes_1.default);
        this.app.use('/api/articulos', ArticulosRoutes_1.default);
        this.app.use('/api/archivoYArticulo', ArchivoYArticuloRoutes_1.default);
        this.app.use('/api/eventos', EventosRoutes_1.default);
        this.app.use('/api/actividades', ActividadesRoutes_1.default);
        this.app.use('/api/comisiones', ComisionesRoutes_1.default);
        this.app.use('/api/profesorYComision', ProfesorYComisionRoutes_1.default);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
            console.log('Visit', 'http://localhost:' + this.app.get('port'), 'to check');
        });
    }
}
const server = new Server();
server.start();
