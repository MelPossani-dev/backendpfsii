import { Router } from "express";
import FabricanteCtrl from "../Controle/fabricanteCtrl.js";

const fabCtrl = new FabricanteCtrl();
const rotaFabricante = new Router();

rotaFabricante
.get('/', fabCtrl.consultar)
.get('/:termo', fabCtrl.consultar)
.post('/', fabCtrl.gravar)
.patch('/', fabCtrl.atualizar)
.put('/', fabCtrl.atualizar)
.delete('/', fabCtrl.excluir);

export default rotaFabricante;