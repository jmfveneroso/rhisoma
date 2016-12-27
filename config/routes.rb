Rails.application.routes.draw do
  root 'sessions#new'

  get 'about',   to: 'static_pages#about'
  get 'signup',  to: 'users#new'

  post   '/login',   to: 'sessions#create'
  delete '/logout',  to: 'sessions#destroy'

  resources :users
  resources :account_activations, only: [:edit]
  resources :password_resets,     only: [:new, :create, :edit, :update]
  resources :email_resets,        only: [:new, :create, :edit, :update]

  get  'home',                     to: 'users#home'
  scope '/settings' do
    get  'profile',                to: 'users#profile'
    get  'account',                to: 'users#account' 
    get  'confirm_delete_account', to: 'users#confirm_delete_account'
    post 'change_password',        to: 'users#change_password'
    post 'delete_account',         to: 'users#delete_account'
  end

  resources :nodes
  post   'nodes/:id/connect',               to: 'nodes#connect', as: :connect
  get    'nodes/graph/show',                to: 'nodes#graph'
  delete 'nodes/:id/disconnect',            to: 'nodes#disconnect', as: :disconnect
end
