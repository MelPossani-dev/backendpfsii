import Fabricante from "../Modelo/fabricante.js";
import conectar from "./conexao.js"; 

export default class FabricanteDAO {
    
    constructor() {
        this.init();
    }
    
    async init() {
        try {
            const conexao = await conectar(); 
            const sql = `
                CREATE TABLE IF NOT EXISTS fabricante (
                    fab_codigo INT NOT NULL AUTO_INCREMENT,
                    fab_empresa VARCHAR(100) NOT NULL,
                    CONSTRAINT pk_fabricante PRIMARY KEY (fab_codigo)
                );`;
            await conexao.execute(sql);
            await conexao.release();
        } catch (e) {
            console.error("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async gravar(fabricante) {
        if (fabricante instanceof Fabricante) {
            const sql = "INSERT INTO fabricante(fab_empresa) VALUES(?)"; 
            const parametros = [fabricante.fab_empresa];
            const conexao = await conectar();
            try {
                const retorno = await conexao.execute(sql, parametros);
                fabricante.fab_codigo = retorno[0].insertId; 
            } catch (e) {
                console.error("Erro ao gravar o fabricante: " + e.message);
            } finally {
                await conexao.release(); 
            }
        }
    }

    async atualizar(fabricante) {
        if (fabricante instanceof Fabricante) {
            const sql = "UPDATE fabricante SET fab_empresa = ? WHERE fab_codigo = ?"; 
            const parametros = [fabricante.fab_empresa, fabricante.fab_codigo];
            const conexao = await conectar(); 
            try {
                await conexao.execute(sql, parametros); 
            } catch (e) {
                console.error("Erro ao atualizar o fabricante: " + e.message);
            } finally {
                await conexao.release(); 
            }
        }
    }

    async excluir(fabricante) {
        if (fabricante instanceof Fabricante) {
            const sql = "DELETE FROM fabricante WHERE fab_codigo = ?"; 
            const parametros = [fabricante.fab_codigo];
            const conexao = await conectar(); 
            try {
                await conexao.execute(sql, parametros); 
            } catch (e) {
                console.error("Erro ao excluir o fabricante: " + e.message);
            } finally {
                await conexao.release(); 
            }
        }
    }

    async consultar(parametroConsulta) {
        let sql = '';
        let parametros = [];
        
        if (!isNaN(parseInt(parametroConsulta))) {
            // Consultar pelo código do fabricante
            sql = 'SELECT * FROM fabricante WHERE fab_codigo = ? ORDER BY fab_empresa';
            parametros = [parametroConsulta];
        } else {
            // Consultar pela empresa
            if (!parametroConsulta) {
                parametroConsulta = '';
            }
            sql = "SELECT * FROM fabricante WHERE fab_empresa LIKE ?";
            parametros = ['%' + parametroConsulta + '%'];
        }
        
        const conexao = await conectar();
        let listaFabricantes = [];
        try {
            const [registros] = await conexao.execute(sql, parametros);
            for (const registro of registros) {
                const fabricante = new Fabricante(registro.fab_codigo, registro.fab_empresa);
                listaFabricantes.push(fabricante);
            }
        } catch (e) {
            console.error("Erro ao consultar fabricantes: " + e.message);
        } finally {
            await conexao.release(); 
        }

        return listaFabricantes;
    }

    async possuiProdutos(fabricante) {
        if (fabricante instanceof Fabricante) {
            const sql = `SELECT COUNT(*) as qtd FROM maquina m
                         INNER JOIN fabricante f ON m.fab_codigo = f.fab_codigo
                         WHERE f.fab_codigo = ?`;
            const parametros = [fabricante.fab_codigo];
            const conexao = await conectar(); 
            try {
                const [registros] = await conexao.execute(sql, parametros);
                return registros[0].qtd > 0;
            } catch (e) {
                console.error("Erro ao verificar se o fabricante possui produtos: " + e.message);
                return false; // Retornar false em caso de erro
            } finally {
                await conexao.release(); 
            }
        }
        return false; // Retornar false se não for uma instância de Fabricante
    }
}