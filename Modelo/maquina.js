import MaquinaDAO from "../Persistencia/maquinaDAO.js";
import Fabricante from "./fabricante.js";

export default class Maquina{
    #maq_codigo;
    #maq_modelo;
    #maq_processador;
    #maq_memoria;
    #maq_ssd;
    #maq_precoCusto;
    #maq_precoVenda;
    #maq_qtdEstoque;
    #fab_codigo;

    constructor(maq_codigo=0,maq_modelo="",maq_processador=0,maq_memoria=0,maq_ssd=0,
                maq_precoCusto="", maq_precoVenda="", maq_qtdEstoque=0, fab_codigo=0){

                this.#maq_codigo = maq_codigo;
                this.#maq_modelo = maq_modelo;
                this.#maq_processador = maq_processador;
                this.#maq_memoria = maq_memoria;    
                this.#maq_ssd = maq_ssd;
                this.#maq_precoCusto = maq_precoCusto;
                this.#maq_precoVenda = maq_precoVenda;
                this.#maq_qtdEstoque = maq_qtdEstoque;
                this.#fab_codigo = fab_codigo;
            }   

    get maq_codigo(){
        return this.#maq_codigo;
    }

    set maq_codigo(novoCodigo){
        this.#maq_codigo = novoCodigo;
    }

    get maq_modelo(){
        return this.#maq_modelo;
    }

    set maq_modelo(novoModelo){
        this.#maq_modelo = novoModelo;
    }

    get maq_processador(){
        return this.#maq_processador;
    }

    set maq_processador(novoProcessador){
        this.#maq_processador = novoProcessador;
    }

    get maq_memoria(){
        return this.#maq_memoria;
    }

    set maq_memoria(novaMemoria){
        this.#maq_memoria = novaMemoria;
    }

    get maq_ssd(){
        return this.#maq_ssd;
    }

    set maq_ssd(novoSSD){
        this.#maq_ssd = novoSSD;
    }

    get maq_precoCusto(){
        return this.#maq_precoCusto;
    }

    set maq_precoCusto(novoPrecoCusto){
        this.#maq_precoCusto = novoPrecoCusto;
    }

    get maq_precoVenda(){
        return this.#maq_precoVenda;
    }

    set maq_precoVenda(novoPrecoVenda){
        this.#maq_precoVenda = novoPrecoVenda;
    }

    get maq_qtdEstoque(){
        return this.#maq_qtdEstoque;
    }

    set maq_qtdEstoque(novaQtdEstoque){
        this.#maq_qtdEstoque = novaQtdEstoque;
    }

    get fab_codigo(){
        return this.#fab_codigo;
    }

    set fab_codigo(novoCodigo){
        this.#fab_codigo = novoCodigo;
    }

    toJSON(){
        return {
            maq_codigo: this.#maq_codigo,
            maq_modelo: this.#maq_modelo,
            maq_processador: this.#maq_processador,
            maq_memoria: this.#maq_memoria,
            maq_ssd: this.#maq_ssd,
            maq_precoCusto: this.#maq_precoCusto,
            maq_precoVenda: this.#maq_precoVenda,
            maq_qtdEstoque: this.#maq_qtdEstoque,
            fab_codigo: this.#fab_codigo
        }
    }

     //camada de modelo acessa a camada de persistencia
     async gravar(){
        const maqDAO = new MaquinaDAO();
        await maqDAO.gravar(this);
     }
 
     async excluir(){
        const maqDAO = new MaquinaDAO();
        await maqDAO.excluir(this);
     }
 
     async atualizar(){
        const maqDAO = new MaquinaDAO();
        await maqDAO.atualizar(this);
     }
 
     async consultar(termo){
        const maqDAO = new MaquinaDAO();
        return await maqDAO.consultar(termo);
     }

}