class AddDefaultToNodeGroups < ActiveRecord::Migration[5.0]
  def change
    change_column :node_groups, :public, :boolean, :default => false
  end
end
