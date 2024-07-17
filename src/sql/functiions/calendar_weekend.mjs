/**
 *
 * @returns {SqlFunction}
 */
export function createCalendarWeekendLoadFunc() {
    return {
        query: `
create function common.calendar_weekend_load(_market text, _year integer) returns jsonb
    language plpgsql
as
$$
DECLARE result jsonb;
Begin
    select  data
    INTO result
    from common.calendar_weekend as c
    where c.market =_market and year =_year and close_date is null;

    return result;
END
$$;
GRANT ALL ON FUNCTION common.calendar_weekend_load TO ytineres_user;
			
		`
    };
}
/**
 *
 * @returns {SqlFunction}
 */
export function createCalendarWeekendLoadManyFunc() {
    return {
        query: `
create function common.calendar_weekend_load_many(_data jsonb) returns jsonb
    language plpgsql
as
$$
DECLARE
    result jsonb;
Begin
    select json_agg(jsonb_build_object('market', m.id, 'year', y.number, 'data', data))
    INTO result
    from jsonb_array_elements_text(_data -> 'marketIds') as m(id)
             inner join jsonb_array_elements(_data -> 'years') as y(number) on 1 = 1
             left join common.calendar_weekend as c on c.market = m.id and c.year = y.number::int
    where c.close_date is null;
    IF result is null THEN
        RETURN '[]'::jsonb;
    END IF;

    return result;
END
$$;
GRANT ALL ON FUNCTION common.calendar_weekend_load_many TO ytineres_user;
		`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createCalendarWeekendUploadFunc() {
    return {
        query: `
create procedure common.calendar_weekend_upload( data jsonb,  _market text,  _year integer,  creator text)
    language plpgsql
as
$$
DECLARE
    cur_dt timestamptz;
BEGIN
    cur_dt = now();

    UPDATE common.calendar_weekend
    SET close_date = cur_dt
    where close_date is null AND "market" = _market and "year" = _year;

    INSERT INTO common.calendar_weekend (uid, market,"year",data, open_date, close_date, creator)
    VALUES (uuid_generate_v4(), _market, _year, data, cur_dt, null, creator);

END
$$;
GRANT ALL ON FUNCTION common.calendar_weekend_upload TO ytineres_user;
		
		`
    };
}
