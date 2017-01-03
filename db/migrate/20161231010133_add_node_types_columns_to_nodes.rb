class AddNodeTypesColumnsToNodes < ActiveRecord::Migration[5.0]
  def change
    add_column :nodes, :description, :text
    add_column :nodes, :start_date, :datetime
    add_column :nodes, :end_date, :datetime
    add_column :nodes, :location, :string
    add_column :nodes, :text, :text
    add_column :nodes, :link, :string
  end
end
