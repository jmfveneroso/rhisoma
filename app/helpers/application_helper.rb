# Rails base class for helper functions. These helpers are available to all templates by default.
# 
# @author João Mateus de Freitas Veneroso
# @since 0.1.0
module ApplicationHelper
  # Generates the full page title "Subtitle | Orkhestra".
  # @param page_title [String] the subtitle.
  # @return [String] the full title.
  def full_title(page_title = '')
    base_title = 'Orkhestra'
    if page_title.empty?
      base_title
    else
      page_title + ' | ' + base_title
    end
  end

  # Punctuates a list by inserting the proper clause separators.
  # @param list [Array<String>] the list to be punctuated.
  # @return [String] the punctuated string.
  def punctuate(list)
    last = list.pop if list.length > 1
    str = list.join(', ') + (!last.nil? ? " and #{last}"  : '') + '.'
  end
end
