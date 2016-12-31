class NodeGroup < ApplicationRecord
  belongs_to :user

  validate :validate_user_id

  private
  
    def validate_user_id
      errors.add(:user_id, "is invalid") unless User.exists?(self.user_id)
    end
end
