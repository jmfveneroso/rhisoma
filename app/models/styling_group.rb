class StylingGroup < ApplicationRecord
  belongs_to :user
  validate :validate_user_id

  VALID_COLOR_REGEX = /\A#(?:[0-9a-fA-F]{3}){1,2}\z/i
  validates :color, presence: true,
                    format: { with: VALID_COLOR_REGEX }

  validates :user_id, presence: true
  validates :name, presence: true, length: { maximum: 255 }

  has_many :nodes

  private
    def validate_user_id
      errors.add(:user_id, "is invalid") unless User.exists?(self.user_id)
    end
end
