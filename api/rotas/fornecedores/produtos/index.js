const roteador = require('express').Router({mergeParams: true})
const Tabela = require('./tabelaProduto')
const Produto = require('./Produto')
const SerializadorProduto = require('../../../Serializador').SerializadorProduto

roteador.get('/', async (requisicao, resposta) => {
    const produtos = await Tabela.listar(requisicao.fornecedor.id)
    const serializador = new SerializadorProduto(
        resposta.getHeader('Content-Type')
    )
    resposta.send(
        serializador.serializar(produtos)
    )
})

roteador.post('/', async (requisicao, resposta, proximo) => {
    try {
        const idFornecedor = requisicao.fornecedor.id
        const corpo = requisicao.body
        const dados = Object.assign({}, corpo, {fornecedor: idFornecedor})
        const produto = new Produto(dados)
        await produto.criar()
        const serializador = new SerializadorProduto(
            resposta.getHeader('Content-Type')
        )
        resposta.status(201)
        resposta.send(
            serializador.serializar(produtos)
        )
    } catch (erro) {
        proximo(erro)
    }
})

roteador.delete('/:id', async (requisicao, resposta) => {
    const dados = {
        id: requisicao.params.id,
        fornecedor: requisicao.fornecedor.id
    }
    const produto = new Produto(dados)
    await produto.apagar()
    resposta.status(204)
    resposta.end()
})

roteador.get('/:id', async (requisicao, resposta, proximo) => {
    try {
        const dados = {
            id: requisicao.params.id,
            fornecedor: requisicao.fornecedor.id
        }
        const produto = new Produto(dados)
        await produto.carregar()
        const serializador = new SerializadorProduto(
            resposta.getHeader('Content-Type'),
            ['preco', 'estoque', 'fornecedor', 'dataCriacao', 'dataAtualizacao', 'versao']
        )
        resposta.send(
            serializador.serializar(produtos)
        )
    } catch(erro) {
        proximo(erro)
    }
})

const roteadorReclamacoes = require('./reclamacoes')
const Serializador = require('../../../Serializador')
roteador.use('/:idProduto/reclamacoes', roteadorReclamacoes)

module.exports = roteador