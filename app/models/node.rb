class Node < ApplicationRecord
  # Returns the allowed node types.
  def self.types
    %w(CategoryNode TaskNode TextNode LinkNode)
  end

  validates :title, presence: true, length: { maximum: 255 }
  validates :type, presence: true, inclusion: { in: self.types,
    message: "%{value} is not a valid type" }
  validate :validate_node_group_id

  belongs_to :node_group
  has_one :user, :through => :node_group
  has_many(:edges, :foreign_key => :source_id, :dependent => :destroy)
  has_many(:reverse_edges, :class_name => :Edge,
     :foreign_key => :target_id, :dependent => :destroy)
  has_many :nodes, :through => :edges, :source => :target

  private

    def validate_node_group_id
      errors.add(:node_group_id, "is invalid") unless NodeGroup.
        exists?(self.node_group_id)
    end
end
