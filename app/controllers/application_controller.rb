# Base rails controller.
# 
# @author João Mateus de Freitas Veneroso
# @since 0.1.0
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  include SessionsHelper
  include HttpAcceptLanguage::AutoLocale
end
