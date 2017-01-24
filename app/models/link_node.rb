class LinkNode < Node
  validates :start_date, :end_date, :location, absence: true
  validates :text, absence: true
  validates :link, presence: true, length: { maximum: 255 }
end
