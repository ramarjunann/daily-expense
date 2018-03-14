module Commutatus
  module API
    module V1
      class Expense < Grape::API
        resource :expenses do

          desc 'Creates expense'
          params do
            requires :description, type: String
            requires :category, type: String
            requires :amount, type: String
            requires :user_id, type: String
          end
          post '/', serializer: Serializer::Expense do
            authenticate!

            declared_params = declared(params)
            user = Commutatus::User.find_by(uid: params[:user_id])

            if user

              expense = user.expenses.build(declared_params)
              authorize!(:create, expense)

              if expense.save
                expense
              else
                error!({errors: expense.errors.full_messages, status: 'error'}, 422)
              end

            else
              error!({errors: ['Expense not found'], status: 'error'}, 404)
            end

          end

          route_param :id do

            desc 'Get expense details'
            get '/', serializer: Serializer::Expense do
              authenticate!

              expense = Commutatus::Expense.find_by!(uid: params[:id])

              authorize!(:read, expense)
            end

            desc 'Deletes expense'
            params do
            requires :user_id, type: String
            end
            delete '/' do
              authenticate!

              user = Commutatus::User.find_by(uid: params[:user_id])

              expense = user.expenses.find_by(uid: params[:id])

              if user
                if expense
                  authorize!(:destroy, expense)
                  expense.destroy
                  {status: 'success'}
                else
                  error!({errors: ['Expense not found'], status: 'error'}, 404)
                end
              else
                error!({errors: ['Expense not found'], status: 'error'}, 404)
              end
            end

            desc 'Updates expense'
            params do
              optional :description, type: String
              optional :category, type: String
              optional :amount, type: String
              optional :user_id, type: String
            end
            put '/', serializer: Serializer::Expense do
              authenticate!

              declared_params = declared(params)
              user = Commutatus::User.find_by(uid: declared_params.delete(:user_id))

              if user
                expense = user.expenses.find_by!(uid: params[:id])
                authorize!(:update, expense)

                if expense.update(declared_params)
                  expense
                else
                  error!({errors:expense.errors.full_messages, status: 'error'}, 422)
                end
              else
                  error!({errors: ['Expense not found'], status: 'error'}, 404)
              end
            end
          end

          desc 'Gets expense with pagination support'
          params do
            optional :per_page, type: Integer
            optional :page, type: Integer
            requires :user_id, type: String
          end
          get '/' do
            authenticate!

            user = Commutatus::User.find_by!(uid: params[:seller_id])

            if user
              expenses = user.expenses.order('created_at DESC').page(params[:page]).per(params[:per_page])

              ActiveModel::Serializer::CollectionSerializer.new(
                  expenses,
                  serializer: Serializer::Expense
              )
            else
              error!({errors: ['Access denied.'], status: 'error'}, 403)
            end
          end
        end
      end
    end
  end
end
