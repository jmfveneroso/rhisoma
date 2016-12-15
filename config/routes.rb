Rails.application.routes.draw do
  get 'sessions/new'

  root 'static_pages#home'
  get 'about',   to: 'static_pages#about'
  get 'signup',  to: 'users#signup'
  get 'users/home'
  get 'users/territories'
  get 'users/settings'
  get    '/login',   to: 'sessions#new'
  post   '/login',   to: 'sessions#create'
  delete '/logout',  to: 'sessions#destroy'
  resources :users
  resources :articles

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
