class AddStatusColumnsToNodes < ActiveRecord::Migration[5.0]
  def change
    add_column :nodes, :collapse, :boolean
    add_column :nodes, :standby, :boolean
    add_column :nodes, :complete_date, :datetime
  end
end
