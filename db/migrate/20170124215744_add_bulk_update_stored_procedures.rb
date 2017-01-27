class AddBulkUpdateStoredProcedures < ActiveRecord::Migration[5.0]
  def up
    # We are creating a stored procedure here, which is simply a SQL function
    # that can return void. This stored procedure updates all node positions
    # from a JSON data string transformed into a temporary table.
    # I suppose it is several orders of magnitude faster than multiple queries
    # but tests must be made to make sure this is the case.
    connection.execute(%q{
      CREATE OR REPLACE FUNCTION public.bulk_update_node_pos(in_json_text json)
      RETURNS void
      AS $function$
      BEGIN 
        UPDATE nodes AS t
        SET 
          x = u.x, y = u.y, 
          vx = u.vx, vy = u.vy, 
          fx = u.fx, fy = u.fy
        FROM (
          SELECT
            (rec->>'id')::INT  AS id, 
            (rec->>'x')::FLOAT  AS x, 
            (rec->>'y')::FLOAT  AS y,
            (rec->>'vx')::FLOAT AS vx,
            (rec->>'vy')::FLOAT AS vy,
            (rec->>'fx')::FLOAT AS fx,
            (rec->>'fy')::FLOAT AS fy
          FROM
            json_array_elements(in_json_text) AS rec
        ) AS u
        WHERE t.id = u.id;
      END; $function$
        LANGUAGE plpgsql
    })
  end
  
  def down
    connection.execute(%q{
      DROP FUNCTION public.bulk_update_node_pos(json);
    })
  end
end
