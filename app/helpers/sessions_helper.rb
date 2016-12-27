# The sessions helper defines helpers that handle user authentication logic.
# It is included in the application controller, so the helper methods are
# available in all controllers.
# 
# @author João Mateus de Freitas Veneroso
# @since 0.1.0
module SessionsHelper
  # Logs the user in by defining a session variable with the user id.
  # @param user [User] the user.
  # @return [void]
  def log_in(user)
    session[:user_id] = user.id
  end

  # Remembers a user in a persistent session by setting a permanent cookie.
  # @param user [User] the user.
  # @return [void]
  def remember(user)
    user.remember
    cookies.permanent.signed[:user_id] = user.id
    cookies.permanent[:remember_token] = user.remember_token
  end

  # Forgets a user in a persistent session.
  # @param user [User] the user.
  # @return [void]
  def forget(user)
    user.forget
    cookies.delete(:user_id)
    cookies.delete(:remember_token)
  end

  # Logs the current user out.
  # @return [void]
  def log_out
    forget(current_user)
    session.delete(:user_id)
    @current_user = nil
  end

  # Returns the current logged-in user, if any.
  # @return [User] the user.
  def current_user
    if (user_id = session[:user_id])
      @current_user = User.find_by(id: user_id)
    elsif (user_id = cookies.signed[:user_id])
      user = User.find_by(id: user_id)
      if user && user.authenticated?(:remember, cookies[:remember_token])
        log_in user 
        @current_user = user
      end
    end
  end

  # Returns true if the given user is the current user.
  # @param user [User] the user.
  # @return [Boolean]
  def current_user?(user)
    user == current_user
  end

  # Returns true if the user is logged in, false otherwise.
  # @return [Boolean]
  def logged_in?
    !current_user.nil?
  end

  # Redirects to the stored location (or to default if there is 
  # no stored location).
  # @param default [String] the default location.
  # @return [void]
  def redirect_back_or (default)
    redirect_to(session[:redirect_url] || default)
    session.delete(:redirect_url)
  end

  # Stores the URL trying to be accessed in a session variable.
  # @return [void]
  def store_location
    session[:redirect_url] = request.original_url if request.get?
  end
end
