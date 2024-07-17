/**
 *
 * @returns {SqlFunction}
 */
export function createRightsListFunc() {
    return {
        query: `
CREATE OR REPLACE FUNCTION common.rights_list()
RETURNS JSONB AS
$$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_agg(jsonb_build_object('id', id, 'name', name, 'description', description))
    INTO result
    FROM common.rights;
   
   if result is null then
        result = '[]'::jsonb;
    end if;

    RETURN result;
END;
$$
LANGUAGE plpgsql;

GRANT ALL ON FUNCTION common.rights_list TO ytineres_user;
`
    };
}
