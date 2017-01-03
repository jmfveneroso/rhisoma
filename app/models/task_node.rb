class TaskNode < Node
  validates :start_date, presence: true
  validates :end_date, presence: true
  validates :text, absence: true
  validates :link, absence: true
end
