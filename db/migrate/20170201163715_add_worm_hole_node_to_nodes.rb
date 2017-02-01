class AddWormHoleNodeToNodes < ActiveRecord::Migration[5.0]
  def change
    add_column :nodes, :target_territory_id, :integer 
  end
end
