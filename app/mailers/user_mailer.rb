# The user mailer implements email sending functions for
# user account management.
# 
# @author João Mateus de Freitas Veneroso
# @since 0.1.0
class UserMailer < ApplicationMailer
  # Sends account activation mail.
  # @param user [User]
  def account_activation(user)
    @user = user
    mail to: user.email, subject: "Account activation"
  end

  # Sends password reset mail.
  # @param user [User]
  def password_reset(user)
    @user = user
    mail to: user.email, subject: "Password reset"
  end

  # Sends email reset mail.
  # @param user [User]
  def email_reset(user)
    @user = user
    mail to: user.new_email, subject: "Email reset"
  end
end
