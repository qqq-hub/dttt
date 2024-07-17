/**
 * Создание объекта скрипта
 *
 * @param {string} query - текстовый скрипт
 * @returns {()=>{query:string, skip?:boolean}} A function that returns an object containing the `query` property.
 */
export function q(query, skip = false) {
    return () => ({ query, skip });
}
