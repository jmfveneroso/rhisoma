class TextNode < Node
  validates :start_date, :end_date, :location, absence: true
  validates :text, presence: true
  validates :link, absence: true
end
