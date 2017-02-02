class Territory < ApplicationRecord
  belongs_to :user

  validate :validate_user_id
  validates :name, presence: true, length: { maximum: 255 }

  has_many :nodes, :dependent => :destroy
  has_many :edges, :through => :nodes
  has_many :styling_groups, :through => :nodes

  def clone(new_territory)
    fields = [:name, :color, :user_id]
    sgs = self.styling_groups.distinct
    sg_id_map = bulk_insert(sgs, 'styling_groups', fields) do |sg|
      sg.user_id = new_territory.user_id
    end

    fields = [:title, :type, :description, :start_date, :end_date, :text, :link, 
      :target_territory_id, :active, :hidden, :territory_id, :styling_group_id, 
      :created_at, :updated_at]
    node_id_map = bulk_insert(self.nodes, 'nodes', fields) do |n|
      n.territory_id = new_territory.id
      sg_id = n.styling_group_id
      n.styling_group_id = sg_id_map.key?(sg_id) ? sg_id_map[sg_id] : nil
      n.created_at = Time.zone.now
      n.updated_at = Time.zone.now
    end

    fields = [:source_id, :target_id, :category]
    bulk_insert(self.edges, 'edges', fields) do |e|
      e.source_id = node_id_map[e.source_id]
      e.target_id = node_id_map[e.target_id]
    end
  end

  private
  
    def validate_user_id
      errors.add(:user_id, "is invalid") unless User.exists?(self.user_id)
    end

    # Transforms a row into SQL friendly input.
    def sqlize_row_values(row, fields)
      row_str = fields.map { |field|
        text = row[field]
        text = row[field].getutc if row[field].is_a? ActiveSupport::TimeWithZone
        row[field] ? ("'#{text}'") : 'NULL'  
      }.join(',')
      return "(#{row_str})"
    end

    # Inserts multiple values into a table through a single query.
    def bulk_insert(elements, table_name, fields)
      return {} if elements.count == 0

      values = elements.map { |e| 
        yield e
        sqlize_row_values e, fields
      }.join(",")

      id_map = {}
      query = "INSERT INTO #{table_name} (#{fields.join(',')}) " +
              "VALUES #{values} RETURNING id"
      response = ActiveRecord::Base.connection.execute query
      for i in (0..response.num_tuples - 1)
        id_map[elements[i].id] = response[i]['id']
      end
 
      return id_map
    end
end
