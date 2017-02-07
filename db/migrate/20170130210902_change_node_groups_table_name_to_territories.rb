class ChangeNodeGroupsTableNameToTerritories < ActiveRecord::Migration[5.0]
  def self.up
    rename_table :node_groups, :territories
    rename_column :nodes, :node_group_id, :territory_id
  end

  def self.down
    rename_table :territories, :node_groups
    rename_column :nodes, :territory_id, :node_group_id
  end
end
