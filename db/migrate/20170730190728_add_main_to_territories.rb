class AddMainToTerritories < ActiveRecord::Migration[5.0]
  def change 
    add_column :territories, :main, :boolean, :default => false
  end
end
