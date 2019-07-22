import React, { Component } from 'react';
import { db } from '../database';

export default class Users extends Component {

  static createUser = async (nome, sexo, foto) => {
    var iduser = undefined
    await db.transaction(async function (tx) {
      await tx.executeSql(
        'INSERT INTO user VALUES (?,?,?,?)',
        [null, nome, sexo, foto],
        (tx, results) => {
          iduser = results.insertId
          if (results.rowsAffected > 0) {
            console.warn("teste salvo")
          } else {
            console.warn('Registration Failed');
          }
        }
      );
    });
    return iduser
  }

  static updateUser = async (nome, sexo, foto, id) => {
    await db.transaction((tx) => {
      tx.executeSql(
        'UPDATE user set nome=?, sexo=?, foto=? where id=?',
        [nome, sexo, foto, id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.warn("teste salvo")
          } else {
            console.warn('Registration Failed');
          }
        }
      );
    });
  }

  static deleteUser = async (id) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM  user where id=?',
        [id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.warn('teste deletado');
          } else {
            console.warn('delete Failed');
          }
        }
      );
    });
  }

  static getAll = async () => {
    var temp = [];
    await db.transaction(tx => {
      tx.executeSql('SELECT * FROM user', [], (tx, results) => {
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
      });
    });
    return temp
  }

  static getUserById = async (id) => {
    var temp = [];
    await db.transaction(tx => {
      tx.executeSql('SELECT * FROM user where id=?', [id], (tx, results) => {
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
      });
    });
    return temp
  }

}
