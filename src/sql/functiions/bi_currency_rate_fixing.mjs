/**
 *
 * @returns {SqlFunction}
 */
export function createBiCurrencyRateFixingLoadFunc() {
    return {
        query: `
create function common.bi_currency_rate_fixing_load(_bi_currency text, d_from date, d_to date) returns jsonb
    stable
    language plpgsql
as
$$
DECLARE
    result jsonb;
Begin
    select json_agg(jsonb_build_object('value', "value", 'date', "date"))
    INTO result
    from common.bi_currency_rate_fixing as b
    where b.bi_currency =_bi_currency and b.date between d_from and d_to ;

    IF result is null THEN
        RETURN '[]'::jsonb;
    END IF;

    return result;
END
$$;

GRANT ALL ON FUNCTION common.bi_currency_rate_fixing_load TO ytineres_user;
			
		`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createBiCurrencyRateFixingUploadFunc() {
    return {
        query: `
CREATE PROCEDURE common.bi_currency_rate_fixing_upload(_bi_currency text, data jsonb)
    language plpgsql
as
$$
BEGIN
    insert into common.bi_currency_rate_fixing as source (bi_currency,date, value)
    select _bi_currency, (list.data->>'date')::date, (list.data->>'value')::float
    from jsonb_array_elements(data)as list(data)
    ON CONFLICT (bi_currency, date) DO UPDATE
    SET value = excluded.value;
END
$$;


GRANT ALL ON PROCEDURE common.bi_currency_rate_fixing_upload TO ytineres_user;
			
		`
    };
}
