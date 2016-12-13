module ApplicationHelper
  def render_dev
    return '' unless Rails.env.development?
  end
  def render_prod
    return '' unless Rails.env.production?
  end
end
