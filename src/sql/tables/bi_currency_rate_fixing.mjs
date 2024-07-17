/**
 *
 * @returns {SqlTable}
 */
export function createBiCurrencyRateFixingTable() {
    return {
        query: `
				CREATE TABLE common.bi_currency_rate_fixing
				(
						bi_currency text             not null
								references bi_currency_basket,
						date        date             not null,
						value       double precision not null
				);
				CREATE UNIQUE INDEX uq_general_common_bi_currency_rate_fixing
					on common.bi_currency_rate_fixing (bi_currency, date);
			
    `
    };
}
