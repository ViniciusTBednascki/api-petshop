const Modelo = require('./modeloTabelaFornecedor')
const NaoEncontrado = require('../../erros/NaoEncontrado')

module.exports = {
    listar () {
        return Modelo.findAll(
            { raw:true } //assim o sequelize ira devolver um objeto puro sem ser um instancia do proprio Sequelize
            )
    },
    inserir(fornecedor) {
        return Modelo.create(fornecedor)
    },
    async buscarPorId(id) {
        const encontrado = await Modelo.findOne({
            where: {
                id: id
            }
        })

        if(!encontrado) {
            throw new NaoEncontrado()
        }

        return encontrado
    },
    atualizar(id, dadosParaAtualizar){
        return Modelo.update(
            dadosParaAtualizar,
            {
                where: {id: id}
            }
        )
    },
    remover(id) {
        return Modelo.destroy({
            where: {id : id}
        })
    }
}