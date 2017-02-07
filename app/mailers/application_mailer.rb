# Rails base mailer class.
# 
# @author João Mateus de Freitas Veneroso
# @since 0.1.0
class ApplicationMailer < ActionMailer::Base
  default from: 'noreply@orkhestra.com'
  layout 'mailer'
end
