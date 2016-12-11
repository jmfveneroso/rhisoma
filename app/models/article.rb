class Article
  include Cequel::Record

  key :id, :timeuuid, auto: true
  column :title, :text
  column :text, :text
end
