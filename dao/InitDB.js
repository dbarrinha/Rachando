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
                    txn.executeSql('DROP TABLE IF EXISTS user', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS user(id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(30))',
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