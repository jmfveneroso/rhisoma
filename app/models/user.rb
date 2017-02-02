# The user model stores all authentication and user account data.
# 
# @author João Mateus de Freitas Veneroso
# @since 0.1.0
class User < ApplicationRecord
  # These tokens represent the unhashed version of a digest stored
  # in the database.
  attr_accessor :remember_token, :activation_token, 
                :reset_token, :email_reset_token

  has_many :territories, dependent: :destroy
  has_many :styling_groups, dependent: :destroy
  has_many :nodes, through: :territories
  has_many :edges, through: :territories

  # This regex is not 100% guaranteed because email addresses may contain 
  # all sorts of unusual characters but it is good enough for 99.9% of 
  # the cases.
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence: true, length: { maximum: 255 }, 
                    format: { with: VALID_EMAIL_REGEX }, 
                    uniqueness: { case_sensitive: false }
  validates :password, presence: true, length: { minimum: 6 }, allow_nil: true
  validate  :is_new_email_valid

  # All emails are converted to downcase before storing at the database.
  before_save :downcase_email
  before_create :create_activation_digest

  has_secure_password

  class << self
    # Returns the hash digest of the given string using the bcrypt 
    # hash function.
    # @param string [String] the string to convert.
    # @return [String] the hash digest.
    def digest(string)
      cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST :
                                                    BCrypt::Engine.cost
      BCrypt::Password.create(string, cost: cost)
    end

    # Returns a random token.
    # @return [String] random string.
    def new_token
      SecureRandom.urlsafe_base64
    end
  end

  # Remembers a user in the database for use in persistent sessions.
  # @return [void]
  def remember
    self.remember_token = User.new_token
    update_attribute(:remember_digest, User.digest(remember_token))
  end

  # Forgets a user.
  # @return [void]
  def forget
    update_attribute(:remember_digest, nil)
  end

  # Returns true if the given token matches the digest. This function
  # can authenticate email reset, password reset, activation 
  # and session digests.
  # @param [Symbol] `reset_email`, `reset_password`, `activation` or `remember`
  # @return [Boolean]
  def authenticated?(attribute, token)
    digest = self.send("#{attribute}_digest")
    return false if digest.nil?
    password = BCrypt::Password.new(digest).is_password?(token)
  end

  # Activates an account.
  # @return [void]
  def activate
    update_columns(activated: true, activated_at: Time.zone.now)
  end

  # Sends activation email.
  # @return [void]
  def send_activation_email
    UserMailer.account_activation(self).deliver_now
  end

  # Sets the password reset attributes.
  # @return [void]
  def create_reset_digest
    self.reset_token = User.new_token
    update_columns(reset_digest: User.digest(reset_token), 
                   reset_sent_at: Time.zone.now)
  end

  # Sends password reset email.
  # @return [void]
  def send_password_reset_email
    UserMailer.password_reset(self).deliver_now
  end

  # Sends email reset email.
  # @return [void]
  def send_email_reset_email
    UserMailer.email_reset(self).deliver_now
  end

  # Returns true if a password reset has expired.
  # @return [Boolean]
  def password_reset_expired?
    reset_sent_at < 2.hours.ago
  end

  # Creates email reset digest.
  # @return [void]
  def create_email_reset_digest
    self.email_reset_token = User.new_token
    update_columns(email_reset_digest: User.digest(email_reset_token), 
                   email_reset_sent_at: Time.zone.now)
  end

  # Sends email reset confirmation message.
  # @return [void]
  def send_email_reset_email
    UserMailer.email_reset(self).deliver_now
  end

  # Returns true if an email reset has expired.
  # @return [Boolean]
  def email_reset_expired?
    email_reset_sent_at < 2.hours.ago
  end

  def graph
    { nodes: self.nodes, edges: self.edges }
  end

  private

    # Converts email to all lower-case.
    # @return [String] the downcased email.
    def downcase_email
      self.email = email.downcase
    end

    # Creates and assigns the activation token and digest.
    # @return [void]
    def create_activation_digest
      self.activation_token  = User.new_token
      self.activation_digest = User.digest(activation_token)
    end

    # Validates a new email address with the same rules valid for the 
    # email column.
    def is_new_email_valid
      if new_email.present? 
        is_valid = (VALID_EMAIL_REGEX =~ new_email).nil?
        is_unique = User.find_by(email: new_email)
 
        errors.add(:new_email, "is too long")       if new_email.length > 255
        errors.add(:new_email, "is invalid")        if is_valid
        errors.add(:new_email, "is already taken")  if is_unique
      end
    end
end
