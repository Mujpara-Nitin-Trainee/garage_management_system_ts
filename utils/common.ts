import conn from '../config/dbConfig';
import {  affectedRows, insertedRows, selectQueryHandler } from '../types/commonInterface';

// dynamic insert with table name, fields and respective values
export const insert = async (tableName:string, fields:string[], values:string[]) => {
  try {
    let query = `INSERT INTO ${tableName} (${fields}) VALUES(?);`;
    let result:insertedRows[] = await conn.query(query, [values]) as insertedRows[];
    return result[0].insertId;
  } catch (error) {
    return { error };
  }
}

// dynamic update with table name, fields, values, column name and column values of conditions
export const update = async (tableName:string, fields:string[], values:string, columnName:string, columnValue:string) => {
  try {
    let res = {};
    let str = "";
    for (let key in fields) {
      str += `${fields[key]} = '${values[key]}', `;
    }
    str = str.slice(0, str.length - 2);

    let query = `UPDATE ${tableName} SET ${str} WHERE ${columnName} = ?;`;
    let result:affectedRows[] = await conn.query(query, columnValue) as affectedRows[];
    return result[0].affectedRows;
  } catch (error) {
    return { error };
  }
}

// dynamic delete with table name and condition fields and values
export const deleteFrom = async (tableName:string, fieldName:string, values:string) => {
  try {
    let query = `DELETE FROM ${tableName} WHERE ${fieldName} = ?;`;
    let result:affectedRows[] = await conn.query(query, values) as affectedRows[];
    return result[0].affectedRows;
  } catch (error) {
    return { error };
  }
}

// dynamic select with table name
export const select = async (tableName:string) => {
  try {
    let query = "SELECT * FROM " + tableName + ";";
    let result:selectQueryHandler = await conn.query(query) as selectQueryHandler;
    return result[0];
  } catch (err) {
    return { err };
  }
};

// get user details with email id
export const findOne = async (email:string) => {
  try {
    let query = "SELECT * FROM users WHERE email = ?";
    let result:selectQueryHandler = await conn.query(query, [email]) as selectQueryHandler;
    return result[0];
  } catch (error) {
    return { error };
  }
};