import { db } from './database'

export const initDB = () => {
    ///TABELA MESA
    db.transaction(function (txn) {
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='mesa'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS mesa', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS mesa(id INTEGER PRIMARY KEY AUTOINCREMENT, descricao VARCHAR(30))',
                        []
                    );
                }
            }
        );
    });

    ///TABELA PRODUTO
    db.transaction(function (txn) {
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='produto'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS produto', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS produto(id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(30))',
                        []
                    );
                    txn.executeSql('INSERT INTO produto VALUES (NULL, ?);', ["Cerveja"]);
                    txn.executeSql('INSERT INTO produto VALUES (NULL, ?);', ["Suco"]);
                    txn.executeSql('INSERT INTO produto VALUES (NULL, ?);', ["Batata Frita"]);
                }
            }
        );
    });

    ///TABELA USERS
    db.transaction(function (txn) {
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='user'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    console.log("usuarios "+res.rows.length)
                    txn.executeSql('DROP TABLE IF EXISTS user', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS user(id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(30), sexo INTEGER ,foto TEXT)',
                        []
                    );
                    txn.executeSql('INSERT INTO user VALUES (NULL, ?, ?, ?);', ["Danilo", 0, ""]);
                }
            }
        );
    });

    ///CONSUMO
    db.transaction(function (txn) {
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='consumo'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS consumo', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS consumo(id INTEGER PRIMARY KEY AUTOINCREMENT,'+
                            'id_mesa INTEGER, id_produto INTEGER ,quantidade INTEGER,preço REAL,' +
                            'FOREIGN KEY(id_mesa) REFERENCES mesa(id)),FOREIGN KEY(id_produto) REFERENCES produto(id))',
                        []
                    );
                }
            }
        );
    });

    ///USUARIOCONSUMO
    db.transaction(function (txn) {
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='usuarioconsumo'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS usuarioconsumo', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS usuarioconsumo(id INTEGER PRIMARY KEY AUTOINCREMENT, id_consumo INTEGER, id_usuario INTEGER'+
                            'FOREIGN KEY(id_consumo) REFERENCES consumo(id)),FOREIGN KEY(id_usuario) REFERENCES user(id))',
                        []
                    );
                }
            }
        );
    }); 

    ///TABELA GRUPO
    db.transaction(function (txn) {
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='grupo'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS grupo', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS grupo(id INTEGER PRIMARY KEY AUTOINCREMENT, descricao VARCHAR(30))',
                        []
                    );
                }
            }
        );
    });
    
}