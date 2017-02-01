class AddTemplateColumnToTerritories < ActiveRecord::Migration[5.0]
  def change
    add_column :territories, :template, :boolean
  end
end
