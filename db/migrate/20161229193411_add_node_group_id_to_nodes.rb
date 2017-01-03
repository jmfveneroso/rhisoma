class AddNodeGroupIdToNodes < ActiveRecord::Migration[5.0]
  def change
    add_column :nodes, :node_group_id, :integer, :null => false
  end
end
