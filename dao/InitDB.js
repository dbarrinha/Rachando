import { db } from './database'

export const initDB = () => {
    ///TABELA MESA
    /*db.transaction(function (txn) {
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='teste'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS teste', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS teste(id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(20))',
                        []
                    );
                }
            }
        );
    });*/
}