/**
 * @typedef {Object} ParamItem
 * @property {string} name -
 * @property {string} type -
 */

/**
 * @typedef {Object} Param
 * @property {ParamItem][]} body -
 * @property {ParamItem[]} query -
 */

/**
 * @typedef {Object} Method
 * @property {string} name -
 * @property {Param[]} params -
 */

/**
 * @typedef {Object} Template
 * @property {string} name -
 * @property {Method[]} services -
 */

/**
 * @type {Template}
 */
const TEMPLATE = {
    name: `bi_currency_basket`,
    services: [
        {
            name: "load",
            http: "get",
            params: {
                query: [{ name: "status", type: "string" }]
            }
        },
        {
            name: "add",
            http: "post",
            params: {
                body: [
                    {
                        name: "data",
                        type: "object",
                        meta: [
                            { name: "name", type: "string" },
                            { name: "description", type: "string" },
                            { name: "marketId", type: "string" }
                        ]
                    },
                    {
                        name: "user",
                        type: "string"
                    }
                ]
            }
        },
        {
            name: "update",
            http: "post",
            params: {
                body: [
                    {
                        name: "data",
                        type: "object",
                        meta: [
                            { name: "name", type: "string" },
                            { name: "description", type: "string" },
                            { name: "marketId", type: "string" }
                        ]
                    },
                    {
                        name: "user",
                        type: "string"
                    }
                ]
            }
        }
    ]
};
module.exports = { TEMPLATE };
