Rails.application.routes.draw do
  get 'user/home'

  get 'user/territories'

  get 'user/settings'

  get 'welcome/index'

  resources :articles

  root 'welcome#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
