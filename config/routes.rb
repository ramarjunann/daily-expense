Rails.application.routes.draw do
  devise_for :users, class_name: Commutatus::User
  mount Commutatus::API::Root => '/'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
