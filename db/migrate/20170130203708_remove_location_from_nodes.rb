class RemoveLocationFromNodes < ActiveRecord::Migration[5.0]
  def self.up
    remove_column :nodes, :location
  end
  
  def self.down
    add_column :nodes, :location, :string
  end
end
