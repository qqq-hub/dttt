/**
 *
 * @returns {SqlTable}
 */
export function createBiCurrencyBasketTable() {
    return {
        query: `
					CREATE TABLE common.bi_currency_basket
					(
							name        text                     not null
									primary key,
							market_id   text                     not null,
							description text,
							open_date   timestamp with time zone not null,
							close_date  timestamp with time zone,
							creator     text                     not null
					);
    `
    };
}
