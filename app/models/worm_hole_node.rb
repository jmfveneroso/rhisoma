class WormHoleNode < Node
  validates :start_date, :end_date, absence: true
  validates :text, absence: true
  validates :link, absence: true
  validates :target_territory_id, presence: true
  validate  :validate_target_territory_id

  private
    def validate_target_territory_id
      errors.add(:target_territory_id, "is invalid") unless Territory.
        exists?(self.target_territory_id)
    end
end
