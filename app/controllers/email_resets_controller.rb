# The email resets controller is similar to the password resets controller,
# but it handles email alteration logic.
# 
# @author João Mateus de Freitas Veneroso
# @since 0.1.0
class EmailResetsController < ApplicationController
  # The user must be logged in to request an email change, but since
  # the update action requests the user password there is no 
  # need to require the user to be logged in during edit and update.
  before_action :logged_in_user,   only: [:new, :create]
  before_action :get_user,         only: [:edit, :update]
  before_action :valid_user,       only: [:edit, :update]
  before_action :check_expiration, only: [:edit, :update]

  # Renders the email change request view.
  # @route GET /emails_resets/new
  def new
    @user = current_user
  end

  # Creates a new email change request. The new email address must be properly
  # checked before it is activated, so a request message is sent to the new
  # email address.
  # @route POST /emails_resets/new
  # @route_param email_reset [new_email]
  def create
    @user = current_user
    # The new email is stored in the database so we can make sure it is 
    # a valid address when the change is confirmed.
    @user[:new_email] = params[:email_reset][:new_email].downcase
    if @user.save
      @user.create_email_reset_digest
      @user.send_email_reset_email
      flash[:info] = t :email_reset_sent
      redirect_to account_path
    else 
      render 'new'
    end
  end

  # Renders the email change confirmation view.
  # @route GET /emails_resets/$(email_reset_token)/edit
  # @route_param email
  def edit
  end

  # Confirms the email change.
  # @route PATCH /emails_resets/$(email_reset_token)
  # @route_param user [email]
  # @route_param user [password]
  def update
    if @user.authenticated?(:password, params[:user][:password])
      @user.email = @user.new_email
      if @user.save
        @user.update_attribute(:new_email, nil)
        @user.update_attribute(:email_reset_digest, nil)
        flash[:success] = t :email_updated 
        log_in @user
      else
        flash[:danger] = t :invalid_email_info
      end
      redirect_to home_path and return
    else
      @user.errors.add(:base, t(:wrong_password))
    end
    render 'edit'
  end

  private

    # Before filter that confirms the user is logged-in.
    def logged_in_user
      unless logged_in?
        store_location
        flash[:danger] = t :please_log_in
        redirect_to login_url
      end
    end

    # Before filter that finds user by email.
    def get_user
      @user = User.find_by(email: params[:email])
    end

    # Before filter that confirms the email reset token is valid.
    def valid_user
      unless @user
        flash[:danger] = t :invalid_user
        redirect_to root_url
        return
      end

      unless @user.activated
        flash[:danger] = t :user_not_activated
        redirect_to root_url
        return
      end

      unless @user.authenticated?(:email_reset, params[:id])
        flash[:danger] = t :invalid_email_reset_token
        redirect_to root_url
      end
    end

    # Before filter that checks the expiration of the email reset token.
    def check_expiration
      if @user.email_reset_expired?
        flash[:danger] = t :email_reset_expired
        redirect_to home_path
      end
    end
end
