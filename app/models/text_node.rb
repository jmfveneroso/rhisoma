class TextNode < Node
  validates :start_date, :end_date, absence: true
  validates :text, presence: true
  validates :link, absence: true
  validates :target_territory_id, absence: true
end
