module Commutatus
  module API
    module V1
      module Serializer
        class User < ActiveModel::Serializer
          attributes :id, :provider, :email, :id, :first_name, :last_name
          def provider
            'uid'
          end

          def id
            object.uid
          end
        end
      end
    end
  end
end
