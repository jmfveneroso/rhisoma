Rails.application.routes.draw do
  root 'static_pages#home'
  get 'about',   to: 'static_pages#about'
  get 'signup',  to: 'user#signup'
  get 'user/home'
  get 'user/territories'
  get 'user/settings'
  resources :articles

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
