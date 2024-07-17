/**
 *
 * @returns {SqlFunction}
 */
export function createUserFieldsAddFunc() {
    return {
        query: `
create procedure common.user_fields_add(data jsonb, creator text, group_id integer)
    language plpgsql
as
    cur_dt timestamptz;
BEGIN
    cur_dt = now();

    INSERT INTO common.user_fields (id, name,description, meta,  open_date, close_date, creator, "group")
    VALUES (data->>'id'::text, data->>'name'::text, data->>'description'::text, (data->>'meta')::jsonb,cur_dt, null, creator, group_id);
END
$$;
GRANT ALL ON FUNCTION common.user_fields_add TO ytineres_user;
			
			`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createUserFieldsLoadFunc() {
    return {
        query: `
create function common.user_fields_load(status text, group_id integer) returns jsonb
    language plpgsql
as
$$
DECLARE result jsonb;
Begin
    select json_agg(jsonb_build_object(
        'id', p.id, 
        'name', p.name, 
        'description', p.description, 
        'meta', p.meta, 
        'status', case when p.close_date is null then 'active' else 'inActive' end ) )
    INTO result
    from common.user_fields as p
    where p."group" = group_id and ((status='inActive' and p.close_date is not null ) or (status='active' and p.close_date is null));
    
    IF result is null THEN
        result =  '[]'::jsonb;
    END IF; 

    return result;
END
$$;
GRANT ALL ON FUNCTION common.user_fields_load TO ytineres_user;
			
			`
    };
}

/**
 *
 * @returns {SqlFunction}
 */
export function createUserFieldsUpdateFunc() {
    return {
        query: `
create procedure common.user_fields_update(data jsonb, creator text, group_id integer)
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

    UPDATE common.user_fields
    SET
        name = data->>'name'::text,
        description = data->>'description'::text,
        meta = (data->>'meta')::jsonb,
        close_date=cur_dt
    where id =(data->>'id')::text AND "group" = group_id;
END
$$;
GRANT ALL ON FUNCTION common.user_fields_update TO ytineres_user;
			
			`
    };
}
