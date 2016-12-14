module ApplicationHelper
  def full_title(page_title = '')
    base_title = 'Orkhestra'
    if page_title.empty?
      base_title
    else
      page_title + ' | ' + base_title
    end
  end

  def render_dev
    return '' unless Rails.env.development?
  end

  def render_prod
    return '' unless Rails.env.production?
  end
end
