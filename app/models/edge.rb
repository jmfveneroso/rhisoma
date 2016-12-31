class Edge < ActiveRecord::Base
  validates :category, presence: true, inclusion: { 
    in: %w(Positioning Relationship Dependency),
    message: "%{value} is not a valid category" }
  validates :target_id, uniqueness: { scope: :source_id,
    message: "multiple connections are not allowed between the same nodes" }
  validate :validate_source_and_target
  validate :validate_self_reference
  validate :validate_reverse_connection

  belongs_to :source, :class_name => :Node
  belongs_to :target, :class_name => :Node
  has_one :user, :through => :source

  private

    def validate_source_and_target
      errors.add(:source_id, "is invalid") unless Node.exists?(self.source_id)
      errors.add(:target_id, "is invalid") unless Node.exists?(self.target_id)
    end

    def validate_self_reference
      errors.add(:source_id, "same as target_id") unless 
        self.source_id != self.target_id
    end

    def validate_reverse_connection
      if Edge.find_by(:source_id => target_id, :target_id => source_id)
        errors.add(:target_id, "already has a connection to source_id")
      end
    end
end
