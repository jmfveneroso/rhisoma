class CategoryNode < Node
  validates :start_date, :end_date, absence: true
  validates :text, absence: true
  validates :link, absence: true
end
