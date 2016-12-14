Rails.application.routes.draw do
  root 'static_pages#home'
  get 'about',   to: 'static_pages#about'
  get 'signup',  to: 'users#signup'
  get 'users/home'
  get 'users/territories'
  get 'users/settings'
  resources :users
  resources :articles

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
