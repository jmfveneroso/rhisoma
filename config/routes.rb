Rails.application.routes.draw do
  root 'sessions#new'

  get 'about',   to: 'static_pages#about'
  get 'signup',  to: 'users#new'
  get 'users/home'
  get 'users/territories'
  get 'users/settings'

  post   '/login',   to: 'sessions#create'
  delete '/logout',  to: 'sessions#destroy'
  resources :users
  resources :articles
  resources :account_activations, only: [:edit]
  resources :password_resets,     only: [:new, :create, :edit, :update]
end
