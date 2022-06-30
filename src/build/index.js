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
const PatentesRoutes_1 = __importDefault(require("./routes/PatentesRoutes"));
const ProfesorYPatenteRoutes_1 = __importDefault(require("./routes/ProfesorYPatenteRoutes"));
const ExternosPatenteRoutes_1 = __importDefault(require("./routes/ExternosPatenteRoutes"));
const RevisorRoutes_1 = __importDefault(require("./routes/RevisorRoutes"));
const ComisionesRoutes_1 = __importDefault(require("./routes/ComisionesRoutes"));
const ProfesorYComisionRoutes_1 = __importDefault(require("./routes/ProfesorYComisionRoutes"));
const TesistasRoutes_1 = __importDefault(require("./routes/TesistasRoutes"));
const ProfesorYTesisRoutes_1 = __importDefault(require("./routes/ProfesorYTesisRoutes"));
const ProyectosRoutes_1 = __importDefault(require("./routes/ProyectosRoutes"));
const ProfesorYProyectoRoutes_1 = __importDefault(require("./routes/ProfesorYProyectoRoutes"));
const ExternosProyectoRoutes_1 = __importDefault(require("./routes/ExternosProyectoRoutes"));
const TutoradosRoutes_1 = __importDefault(require("./routes/TutoradosRoutes"));
const MateriasRoutes_1 = __importDefault(require("./routes/MateriasRoutes"));
const PlanesRoutes_1 = __importDefault(require("./routes/PlanesRoutes"));
const PeriodosRoutes_1 = __importDefault(require("./routes/PeriodosRoutes"));
const ExternosApaRoutes_1 = __importDefault(require("./routes/ExternosApaRoutes"));
const ExternosCodirectorRoutes_1 = __importDefault(require("./routes/ExternosCodirectorRoutes"));
const ProfesorYMateriaRoutes_1 = __importDefault(require("./routes/ProfesorYMateriaRoutes"));
const ProfesorYMateriaMultipleRoutes_1 = __importDefault(require("./routes/ProfesorYMateriaMultipleRoutes"));
const GruposMultiplesRoutes_1 = __importDefault(require("./routes/GruposMultiplesRoutes"));
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
        this.app.use('/api/planes', PlanesRoutes_1.default);
        this.app.use('/api/patentes', PatentesRoutes_1.default);
        this.app.use('/api/profesorYPatente', ProfesorYPatenteRoutes_1.default);
        this.app.use('/api/externosPatente', ExternosPatenteRoutes_1.default);
        this.app.use('/api/revisor', RevisorRoutes_1.default);
        this.app.use('/api/comisiones', ComisionesRoutes_1.default);
        this.app.use('/api/profesorYComision', ProfesorYComisionRoutes_1.default);
        this.app.use('/api/tesistas', TesistasRoutes_1.default);
        this.app.use('/api/profesorYTesis', ProfesorYTesisRoutes_1.default);
        this.app.use('/api/proyectos', ProyectosRoutes_1.default);
        this.app.use('/api/profesorYproyecto', ProfesorYProyectoRoutes_1.default);
        this.app.use('/api/externosProyecto', ExternosProyectoRoutes_1.default);
        this.app.use('/api/tutorados', TutoradosRoutes_1.default);
        this.app.use('/api/materias', MateriasRoutes_1.default);
        this.app.use('/api/periodos', PeriodosRoutes_1.default);
        this.app.use('/api/externosApa', ExternosApaRoutes_1.default);
        this.app.use('/api/externosCodirector', ExternosCodirectorRoutes_1.default);
        this.app.use('api/profesorYMateria', ProfesorYMateriaRoutes_1.default);
        this.app.use('api/profesorYMateriaMultiple', ProfesorYMateriaMultipleRoutes_1.default);
        this.app.use('api/gruposMultiples', GruposMultiplesRoutes_1.default);
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
