const roteador = require('express').Router()
const TabelaFornecedor = require('./tabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor
const TabelaProduto = require('./produtos/tabelaProduto')

roteador.get('/', async (requisicao, resposta) => {
    const resultados = await TabelaFornecedor.listar()
    resposta.status(200)
    const serializador = new SerializadorFornecedor(
        resposta.getHeader('Content-Type')
    )
    resposta.send(
        serializador.serializar(resultados)
    )
})

roteador.post('/', async (requisicao, resposta, proximo) => {
    try {
        const dadosRecebidos = requisicao.body
        const fornecedor = new Fornecedor(dadosRecebidos)
        await fornecedor.criar()
        resposta.status(201)
        const serializador = new SerializadorFornecedor(
            resposta.getHeader('Content-Type')
        )
        resposta.send(
            serializador.serializar(fornecedor)
            )
        } catch(erro) {
            proximo(erro)
        }
    })
    
roteador.get('/:idFornecedor', async (requisicao, resposta, proximo) => {
    try{
        const id = requisicao.params.idFornecedor
        const fornecedor = new Fornecedor({id})
        await fornecedor.carregar()
        resposta.status(200)
        const serializador = new SerializadorFornecedor(
            resposta.getHeader('Content-Type'), ['email', 'dataCriacao', 'dataAtualizacao', 'versao']
        )
        resposta.send(
            serializador.serializar(fornecedor)
        )
    }catch(erro) {
        proximo(erro)
    }
})

roteador.put('/:idFornecedor', async (requisicao, resposta, proximo) => {
    try{
        const id = requisicao.params.idFornecedor
        const dadosRecebidos = requisicao.body
        const dados = Object.assign({}, dadosRecebidos, {id})
        const fornecedor = new Fornecedor(dados)
        await fornecedor.atualizar()
        resposta.status(204)
        resposta.end()
    }catch(erro) {
        proximo(erro)
    }
})

roteador.delete('/:idFornecedor', async (requisicao, resposta, proximo) => {
    try {
        const id = requisicao.params.idFornecedor
        const fornecedor = new Fornecedor({id})
        await fornecedor.carregar()
        await fornecedor.remover()
        resposta.status(204)
        resposta.end()
    } catch(erro) {
        proximo(erro)
    }
})

roteador.post('/:idFornecedor/calcular-reposicao-de-estoque', async (requisicao, resposta, proximo) => {
    try {
        const fornecedor = new Fornecedor({ id: requisicao.params.idFornecedor })
        await fornecedor.carregar()
        const produtos = await TabelaProduto.listar(fornecedor.id, {estoque: 0})
        resposta.send({
            mensagem: `${produtos.length} precisam de reposição de estoque`
        })
      } catch (erro) {
        proximo(erro)
      }
})

const roteadorProdutos = require('./produtos')

const verificarFornecedor = async (requisicao, resposta, proximo) => {
    try {
        const id = requisicao.params.idFornecedor
        const fornecedor = new Fornecedor({ id })
        await fornecedor.carregar()
        requisicao.fornecedor = fornecedor
        proximo()
    } catch (erro) {
        proximo(erro)
    }
}

roteador.use('/:idFornecedor/produtos', verificarFornecedor, roteadorProdutos)

module.exports = roteador