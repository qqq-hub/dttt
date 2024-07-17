/**
 *
 * @returns {SqlFunction}
 */
export function createBiCurrencyBasketAddFunc() {
    return {
        query: `
create procedure common.bi_currency_basket_add(data jsonb, creator text)
    language plpgsql
as
$$
DECLARE
    cur_dt timestamptz;
BEGIN
    cur_dt = now();

    INSERT INTO common.bi_currency_basket ( name, description, market_id,  open_date, close_date, creator)
    VALUES ( data->>'name'::text, data->>'description'::text, data->>'marketId'::text, cur_dt, null, creator);
END
$$;

GRANT ALL ON PROCEDURE common.bi_currency_basket_add TO ytineres_user;
		`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createBiCurrencyBasketLoadFunc() {
    return {
        query: `
create function common.bi_currency_basket_load(status text) returns jsonb
    language plpgsql
as
$$
DECLARE result jsonb;
Begin
    select json_agg(jsonb_build_object(
        'name', p.name,
        'marketId', p.market_id,
        'description', p.description,
        'status', case when p.close_date is null then 'active' else 'inActive' end ) )
    INTO result
    from common.bi_currency_basket as p
    where ((status='inActive' and p.close_date is not null ) or (status='active' and p.close_date is null));

    IF result is null THEN
        result =  '[]'::jsonb;
    END IF;

    return result;
END
$$;


GRANT ALL ON FUNCTION common.bi_currency_basket_load TO ytineres_user;
		`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createBiCurrencyBasketUpdateFunc() {
    return {
        query: `
create procedure common.bi_currency_basket_update(data jsonb, creator text)
    language plpgsql
as
$$
DECLARE
    cur_dt timestamptz;
BEGIN
    cur_dt = null;
    IF data->>'status'::text = 'inActive' THEN
        cur_dt = now();
    END IF;

    UPDATE common.bi_currency_basket
    SET
        description = data->>'description'::text,
        market_id =data->>'marketId'::text,
        close_date=cur_dt
    where name =(data->>'name')::text;
END
$$;



GRANT ALL ON PROCEDURE common.bi_currency_basket_update TO ytineres_user;
		`
    };
}
