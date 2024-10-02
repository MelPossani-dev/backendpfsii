import Maquina from "../Modelo/maquina.js";
import conectar from "./conexao.js";
import Fabricante from "../Modelo/fabricante.js";

export default class MaquinaDAO {
  constructor() {
    this.init();
  }

  async init() {
    try {
      const conexao = await conectar();
      const sql = `
CREATE TABLE IF NOT EXISTS maquina (
    maq_codigo INT NOT NULL AUTO_INCREMENT,
    maq_modelo VARCHAR(100) NOT NULL,
    maq_processador VARCHAR(50) NOT NULL,
    maq_memoria VARCHAR(20) NOT NULL,
    maq_ssd VARCHAR(20) NOT NULL,
    maq_precoCusto DECIMAL(10,2) NOT NULL DEFAULT 0,
    maq_precoVenda DECIMAL(10,2) NOT NULL DEFAULT 0,
    maq_qtdEstoque DECIMAL(10,2) NOT NULL DEFAULT 0,
    fab_codigo INT NOT NULL,
    CONSTRAINT pk_maquina PRIMARY KEY (maq_codigo),
    CONSTRAINT fk_fabricante FOREIGN KEY (fab_codigo) REFERENCES fabricante(fab_codigo)
);
      `;
      await conexao.execute(sql);
      await conexao.release();
    } catch (e) {
      console.error("Não foi possível iniciar o banco de dados: " + e.message);
    }
  }

  async gravar(maquina) {
    if (maquina instanceof Maquina) {
      const sql = `INSERT INTO maquina(maq_modelo, maq_processador, maq_memoria, maq_ssd, maq_precoCusto, maq_precoVenda, maq_qtdEstoque, fab_codigo)
                   VALUES(?,?,?,?,?,?,?,?)`;
      const parametros = [
        maquina.maq_modelo,
        maquina.maq_processador,
        maquina.maq_memoria,
        maquina.maq_ssd,
        maquina.maq_precoCusto,
        maquina.maq_precoVenda,
        maquina.maq_qtdEstoque,
        maquina.fab_codigo,
      ];

      const conexao = await conectar();
      try {
        const retorno = await conexao.execute(sql, parametros);
        maquina.maq_codigo = retorno[0].insertId;
      } catch (e) {
        console.error("Erro ao gravar a máquina: " + e.message);
      } finally {
        global.poolConexoes.releaseConnection(conexao);
      }
    }
  }

  async atualizar(maquina) {
    if (maquina instanceof Maquina) {
      const sql = `UPDATE maquina SET maq_modelo = ?, maq_precoCusto = ?, maq_precoVenda = ?, maq_qtdEstoque = ?, fab_codigo = ?
                   WHERE maq_codigo = ?`;
      const parametros = [
        maquina.maq_modelo,
        maquina.maq_precoCusto,
        maquina.maq_precoVenda,
        maquina.maq_qtdEstoque,
        maquina.fab_codigo,
        maquina.maq_codigo,
      ];

      const conexao = await conectar();
      try {
        await conexao.execute(sql, parametros);
      } catch (e) {
        console.error("Erro ao atualizar a máquina: " + e.message);
      } finally {
        global.poolConexoes.releaseConnection(conexao);
      }
    }
  }

  async excluir(maquina) {
    if (maquina instanceof Maquina) {
      const sql = `DELETE FROM maquina WHERE maq_codigo = ?`;
      const parametros = [maquina.maq_codigo];
      const conexao = await conectar();
      try {
        await conexao.execute(sql, parametros);
      } catch (e) {
        console.error("Erro ao excluir a máquina: " + e.message);
      } finally {
        global.poolConexoes.releaseConnection(conexao);
      }
    }
  }

  async consultar(termo) {
    if (!termo) {
      termo = "";
    }

    const conexao = await conectar();
    let listaMaquinas = [];
    try {
      let sql, parametros;

      if (!isNaN(parseInt(termo))) {
        sql = `SELECT m.maq_codigo, m.maq_modelo, m.maq_processador, m.maq_memoria, m.maq_ssd,
                       m.maq_precoCusto, m.maq_precoVenda, m.maq_qtdEstoque, f.fab_codigo, f.fab_empresa
                FROM maquina m
                INNER JOIN fabricante f ON m.fab_codigo = f.fab_codigo
                WHERE m.maq_codigo LIKE ?
                ORDER BY m.maq_codigo`;
        parametros = [termo];
      } else {
        sql = `SELECT m.maq_codigo, m.maq_modelo, m.maq_processador, m.maq_memoria, m.maq_ssd,
                       m.maq_precoCusto, m.maq_precoVenda, m.maq_qtdEstoque, f.fab_codigo, f.fab_empresa
                FROM maquina m
                INNER JOIN fabricante f ON m.fab_codigo = f.fab_codigo
                WHERE m.maq_modelo LIKE ?
                ORDER BY m.maq_modelo`;
        parametros = ["%" + termo + "%"];
      }

      const [registros] = await conexao.execute(sql, parametros);
      for (const registro of registros) {
        const fabricante = new Fabricante(registro.fab_codigo, registro.fab_empresa);
        const maquina = new Maquina(
          registro.maq_codigo,
          registro.maq_modelo,
          registro.maq_processador,
          registro.maq_memoria,
          registro.maq_ssd,
          registro.maq_precoCusto,
          registro.maq_precoVenda,
          registro.maq_qtdEstoque,
          registro.fab_codigo,
          fabricante
        );
        listaMaquinas.push(maquina);
      }
    } catch (e) {
      console.error("Erro ao consultar máquinas: " + e.message);
    } finally {
      global.poolConexoes.releaseConnection(conexao);
    }

    return listaMaquinas;
  }
}