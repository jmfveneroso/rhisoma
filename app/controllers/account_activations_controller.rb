# The account activations controller is responsible for activating
# accounts after the user has received the activation email.
# 
# @author João Mateus de Freitas Veneroso
# @since 0.1.0
class AccountActivationsController < ApplicationController
  # Activates an account if the activation token matches the digest.
  # @route GET /account_activations/$(activation_token)/edit
  # @route_param User email
  def edit
    user = User.find_by(email: params[:email])
    if user && !user.activated? && user.authenticated?(:activation, params[:id])
      user.activate
      log_in user
      flash[:success] = t :account_activated
    else
      flash[:danger] = t :invalid_activation_link
    end
    redirect_to home_path
  end
end
