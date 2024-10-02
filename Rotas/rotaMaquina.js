import { Router } from "express";
import maquinaCtrl from "../Controle/maquinaCtrl.js";

const maqCtrl = new maquinaCtrl();
const rotaMaquina = new Router();

rotaMaquina
.get('/', maqCtrl.consultar)
.get('/:termo', maqCtrl.consultar)
.post('/', maqCtrl.gravar)
.patch('/', maqCtrl.atualizar)
.put('/', maqCtrl.atualizar)
.delete('/', maqCtrl.excluir);

export default rotaMaquina;