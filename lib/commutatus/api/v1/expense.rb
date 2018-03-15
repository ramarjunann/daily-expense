module Commutatus
  module API
    module V1
      class Expense < Grape::API
        resource :expenses do

          desc 'Creates expense'
          params do
            requires :description, type: String
            requires :amount, type: String
            requires :category, type: String
          end
          post '/', serializer: Serializer::Expense do
            authenticate!

            declared_params = declared(params)
            expense = current_user.expenses.build(declared_params)

            p 'dsdsdsa'
            p '222222222222222222222222222222222222222'

            authorize!(:create, expense)

            if expense.save
              expense
            else
              error!({errors: expense.errors.full_messages, status: 'error'}, 422)
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
            delete '/' do
              authenticate!

              expense = Commutatus::Expense.find_by!(uid: params[:id])

              if expense
                authorize!(:destroy, expense)
                expense.destroy
                {status: 'success'}
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

            user = Commutatus::User.find_by(uid: params[:user_id])

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
