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
                            'id_mesa INTEGER ,quantidade INTEGER,preço REAL,' +
                            'FOREIGN KEY(id_mesa) REFERENCES mesa(id))',
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
                        'CREATE TABLE IF NOT EXISTS usuarioconsumo (id INTEGER PRIMARY KEY AUTOINCREMENT, id_consumo INTEGER, id_usuario INTEGER'+
                            'FOREIGN KEY(id_consumo) REFERENCES consumo(id), FOREIGN KEY(id_usuario) REFERENCES user(id))',
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