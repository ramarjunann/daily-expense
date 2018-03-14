module Commutatus
  module API
    module V1
      module Helper
        module Authentication
          def authenticate!
            authenticate

            error!({errors: ['Unauthorized']}, 401) unless current_user
          end

          def authenticate
            user = Commutatus::User.find_by(uid: headers['Uid'])

            if user && user.valid_auth_token?(headers['Access-Token'])
              env['current_user'] = user
              @current_user = user
            end
          end

          def current_user
            @current_user
          end
        end
      end
    end
  end
end
