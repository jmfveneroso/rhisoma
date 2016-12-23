class EmailResetsController < ApplicationController
  # The user must be logged in to request an email change, but since
  # the password will be asked for during the update there is no 
  # need to require the user to be logged in during edit and update.
  before_action :logged_in_user,   only: [:new, :create]
  before_action :get_user,         only: [:edit, :update]
  before_action :valid_user,       only: [:edit, :update]
  before_action :check_expiration, only: [:edit, :update]

  def new
    @user = current_user
  end

  def create
    @user = current_user
    @user[:new_email] = params[:email_reset][:new_email].downcase
    if @user.save
      @user.create_email_reset_digest
      @user.send_email_reset_email
      flash[:info] = "Email sent to your new email address with reset instructions"
      redirect_to account_path
    else 
      render 'new'
    end
  end

  def edit
  end

  def update
    if @user.authenticated?(:password, params[:user][:password])
      # The new email is taken from the database so that we can
      # make sure it is valid.
      @user.email = @user.new_email
      if @user.save
        @user.update_attribute(:new_email, nil)
        @user.update_attribute(:email_reset_digest, nil)
        flash[:success] = "Email updated"
        log_in @user
      else
        flash[:danger] = "Invalid email information"
      end
      redirect_to home_path and return
    else
      @user.errors.add(:base, 'Wrong password.')
    end
    render 'edit'
  end

  private

    def user_params
      params.require(:user).permit(:email)
    end

    # Before filters.
  
    # Confirms a logged-in user.
    def logged_in_user
      unless logged_in?
        store_location
        flash[:danger] = "Please log in."
        redirect_to login_url
      end
    end

    def get_user
      @user = User.find_by(email: params[:email])
    end

    # Confirms an user with a valid reset_email token.
    def valid_user
      unless @user
        flash[:danger] = "Invalid user"
        redirect_to root_url
        return
      end

      unless @user.activated
        flash[:danger] = "The user is not activated"
        redirect_to root_url
        return
      end

      unless @user.authenticated?(:email_reset, params[:id])
        flash[:danger] = "Invalid email reset token"
        redirect_to root_url
      end
    end

    # Checks expiration of email reset token.
    def check_expiration
      if @user.email_reset_expired?
        flash[:danger] = "Email reset has expired"
        redirect_to home_path
      end
    end
end
