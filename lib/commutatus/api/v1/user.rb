module Commutatus
  module API
    module V1
      class User < Grape::API
        EMAIL_REGEX = /\b[A-Z0-9._%a-z\-]+@(?:[A-Z0-9a-z\-]+\.)+[A-Za-z]{2,4}\z/

        resource :user do
          desc 'Register new user'
          params do
            requires :first_name, type: String
            requires :last_name, type: String
            requires :email, type: String
            requires :password, type: String
            optional :password_confirmation, type: String
            # requires :type, type: String, values: ['seller', 'buyer']
          end

          post 'sign_up' do
            declared_params = declared(params, include_missing: false)
            declared_params[:email] = declared_params[:email].downcase
            user = Commutatus::User.new(declared_params)

            if user.save
              # user.add_role role

              header 'Token-Type', 'Bearer'
              header 'Access-Token', user.auth_token
              header 'Uid', user.uid
              header 'Expiry', "#{user.auth_token_expires_at.to_i}"
              # Clients are used to differential tokens at multi-login system.
              # Currently we support only single-login
              # TODO: Integrate https://github.com/mcordell/grape_devise_token_auth for multi-login support
              client_id = SecureRandom.uuid
              header 'Client', client_id

              {status: 'success', data: V1::Serializer::User.new(user).serializable_hash}
            else
              error!({errors: user.errors.full_messages, status: 'error'}, 422)
            end
          end

          desc 'Authenticates user'
          params do
            requires :email, type: String
            requires :password, type: String
            # requires :type, type: String
          end
          post 'sign_in' do
            declared_params = declared(params, include_missing: false)

            user = Commutatus::User.find_by(email: declared_params[:email].downcase)

            if user&.valid_password?(declared_params[:password])
              # Ensure expired key never goes from API
              user.regenerate_auth_token!

              # Set Authentication headers
              header 'Token-Type', 'Bearer'
              header 'Access-Token', user.auth_token
              header 'Uid', user.uid
              header 'Expiry', "#{user.auth_token_expires_at.to_i}"
              client_id = SecureRandom.uuid
              header 'Client', client_id

              {status: 'success', data: V1::Serializer::User.new(user).serializable_hash}
            else
              error!({errors: ["Invalid username or password."], status: 'error'}, 422)
            end
          end

          desc 'Validates user token'
          get 'validate_token' do
            authenticate!

            {status: 'success', data: V1::Serializer::User.new(current_user).serializable_hash}
          end

          desc 'Sign out user'
          delete 'sign_out', serializer: Serializer::User do
            authenticate!

            current_user.regenerate_auth_token!

            current_user
          end

          desc 'Sends password reset instructions'
          params do
            requires :email, type: String
          end
          post 'generate_reset_password_token' do
            user = Commutatus::User.find_by(email: params[:email].downcase)

            if user
              {reset_password_token: user.send_reset_password_instructions}
            else
              error!({errors: ['Could not find user with given email'], status: 'error'}, 422)
            end
          end

          desc 'Resets password'
          params do
            requires :reset_password_token, type: String
            requires :password, type: String
            requires :password_confirmation, type: String
          end
          put 'reset_password' do
            declared_params = declared(params, include_missing: false)
            user = Commutatus::User.reset_password_by_token(declared_params)

            if user.errors.present?
              error!({errors: user.errors.full_messages, status: 'error'}, 422)
            else
              {status: 'success'}
            end
          end

          desc 'Displays user profile information'
          get 'profile', serializer: Serializer::User do
            authenticate!

            current_user
          end

          desc 'Updates user profile information'
          params do
            optional :first_name, type: String
            optional :last_name, type: String
            optional :email, type: String
          end
          put 'profile', serializer: Serializer::User do
            authenticate!
            declared_params = declared(params)

            authorize!(:update, current_user)

            if current_user.update(declared_params)
              current_user
            else
              error!({errors: current_user.errors.full_messages, status: 'error'}, 422)
            end
          end

          desc 'Changes user password'
          params do
            requires :current_password, type: String
            requires :new_password, type: String
            optional :new_password_confirmation, type: String
          end
          put 'change_password' do
            authenticate!

            if current_user.valid_password?(params[:current_password])
              if current_user.reset_password(params[:new_password], params[:new_password_confirmation])
                {status: 'success'}
              else
                error!({errors: current_user.errors.full_messages, status: 'error'}, 422)
              end
            else
              error!({errors: ['Current password is invalid'], status: 'error'}, 422)
            end
          end

          desc 'Adds role for user'
          params do
            requires :role, type: String, values: ['buyer', 'seller']
          end
          post 'add_role' do
            authenticate!

            current_user.add_role(params[:role])

            {status: 'success'}
          end
        end
      end
    end
  end
end
