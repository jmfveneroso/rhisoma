class NodeGroup < ApplicationRecord
  belongs_to :user

  validate :validate_user_id
  validates :name, presence: true, length: { maximum: 255 }

  has_many :nodes, :dependent => :destroy
  has_many :edges, :through => :nodes

  private
  
    def validate_user_id
      errors.add(:user_id, "is invalid") unless User.exists?(self.user_id)
    end
end
