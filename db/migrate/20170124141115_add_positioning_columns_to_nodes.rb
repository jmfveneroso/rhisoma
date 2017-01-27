class AddPositioningColumnsToNodes < ActiveRecord::Migration[5.0]
  def change
    add_column :nodes, :x,  :float
    add_column :nodes, :y,  :float
    add_column :nodes, :vx, :float
    add_column :nodes, :vy, :float
    add_column :nodes, :fx, :float
    add_column :nodes, :fy, :float
  end
end
