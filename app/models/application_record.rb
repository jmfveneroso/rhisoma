# Rails base active record class. All models extend this class.
# 
# @author João Mateus de Freitas Veneroso
# @since 0.1.0
class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true
end
