const Sequelize = require('sequelize')
const instancia = require('../../banco-de-dados')

const colunas = {
    empresa: {
        type: Sequelize.STRING,
        alowNull: false
    },
    email: {
        type: Sequelize.STRING,
        alowNull: false
    },
    categoria: {
        type: Sequelize.ENUM('ração', 'brinquedos'),
        alowNull: false
    }
}

const opcoes = {
    freezeTableName: true,
    tabelName: 'fornecedores',
    timestamps: true,
    createdAt: 'dataCriacao',
    updatedAt: 'dataAtualizacao',
    version: 'versao'
}

module.exports = instancia.define('fornecedor', colunas, opcoes)