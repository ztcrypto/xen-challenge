Rails.application.routes.draw do
  get 'borrowers/index'
  get 'invoices/index'
  post 'invoices/create'
  post 'invoices/next'
  delete 'invoices/delete'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
