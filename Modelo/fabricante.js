import FabricanteDAO from "../Persistencia/fabricanteDAO.js"; 

export default class Fabricante {
    // Definição dos atributos privados
    #fab_codigo;
    #fab_empresa;

    constructor(codigo = 0, empresa = '') {
        this.#fab_codigo = codigo;
        this.#fab_empresa = empresa;
    }

    // Métodos de acesso públicos
    get fab_codigo() {
        return this.#fab_codigo;
    }

    set fab_codigo(novoCodigo) {
        this.#fab_codigo = novoCodigo;
    }

    get fab_empresa() {
        return this.#fab_empresa;
    }

    set fab_empresa(novaEmpresa) {
        this.#fab_empresa = novaEmpresa;
    }

    // Override do método toJSON
    toJSON() {
        return {
            fab_codigo: this.#fab_codigo,
            fab_empresa: this.#fab_empresa
        };
    }

    // Camada de modelo acessa a camada de persistência
    async gravar() {
        const fabricanteDAO = new FabricanteDAO();
        await fabricanteDAO.gravar(this);
    }

    async excluir() {
        const fabricanteDAO = new FabricanteDAO();
        await fabricanteDAO.excluir(this);
    }

    async atualizar() {
        const fabricanteDAO = new FabricanteDAO();
        await fabricanteDAO.atualizar(this);
    }

    async consultar(parametro) {
        const fabricanteDAO = new FabricanteDAO();
        return await fabricanteDAO.consultar(parametro);
    }

    async possuiProdutos() {
        const fabricanteDAO = new FabricanteDAO();
        return await fabricanteDAO.possuiProdutos(this);
    }
}