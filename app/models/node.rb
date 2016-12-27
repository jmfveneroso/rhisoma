class Node < ApplicationRecord
  belongs_to :user

  validates :title, presence: true, length: { maximum: 255 }

  has_many(:edges, :foreign_key => :source_id, :dependent => :destroy)
  has_many(:reverse_edges, :class_name => :Edge,
     :foreign_key => :target_id, :dependent => :destroy)
  has_many :nodes, :through => :edges, :source => :target
end
