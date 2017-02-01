class LinkNode < Node
  validates :start_date, :end_date, absence: true
  validates :text, absence: true
  validates :link, presence: true, length: { maximum: 255 }
  validates :target_territory_id, absence: true
end
