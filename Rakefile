# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require_relative 'config/application'

require 'rdoc/task'

RDoc::Task.new do |rdoc|
  rdoc.main = "README.rdoc"
  rdoc.rdoc_files.include("README.rdoc", "lib   /*.rb")
end

# RDoc::Task.new do |rdoc|
#   rdoc.main = "README.rdoc"
# 
#   rdoc.rdoc_files.include("README.rdoc", "doc/*.rdoc", "app/**/*.rb", "lib/*.rb", "config/**/*.rb")
#   #change above to fit needs
# 
#   rdoc.title = "App Documentation"
#   rdoc.options << "--all" 
# end

Rails.application.load_tasks
