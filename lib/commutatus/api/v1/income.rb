module Commutatus
  module API
    module V1
      class Income < Grape::API
        resource :incomes do

          desc 'Creates income'
          params do
            requires :description, type: String
            requires :amount, type: String
          end
          post '/', serializer: Serializer::Income do
            authenticate!

            declared_params = declared(params)
            income = current_user.incomes.build(declared_params)

            authorize!(:manage, income)

            if income.save
              income
            else
              error!({errors: income.errors.full_messages, status: 'error'}, 422)
            end

          end

          route_param :id do

            desc 'Get income details'
            get '/', serializer: Serializer::Income do
              authenticate!

              income = Commutatus::Income.find_by!(uid: params[:id])

              authorize!(:read, income)
            end

            desc 'Deletes income'
            delete '/' do
              authenticate!

              income = Commutatus::Income.find_by!(uid: params[:id])

              if income
                authorize!(:destroy, income)
                income.destroy
                {status: 'success'}
              else
                error!({errors: ['Income not found'], status: 'error'}, 404)
              end
            end

            desc 'Updates income'
            params do
              optional :description, type: String
              optional :amount, type: String
            end
            put '/', serializer: Serializer::Income do
              authenticate!

              declared_params = declared(params)
              income = current_user.incomes.find_by!(uid: params[:id])

                authorize!(:update, income)

              if income.update(declared_params)
                income
              else
                error!({errors:income.errors.full_messages, status: 'error'}, 422)
              end
            end
          end

          desc 'Gets income with pagination support'
          params do
            optional :per_page, type: Integer
            optional :page, type: Integer
            requires :user_id, type: String
          end
          get '/' do
            authenticate!

            user = Commutatus::User.find_by(uid: params[:user_id])

            if user
              incomes = user.incomes.order('created_at DESC').page(params[:page]).per(params[:per_page])

              ActiveModel::Serializer::CollectionSerializer.new(
                  incomes,
                  serializer: Serializer::Income
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
