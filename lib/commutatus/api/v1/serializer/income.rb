module Commutatus
  module API
    module V1
      module Serializer
        class Income < ActiveModel::Serializer
          attributes :id, :user_id, :amount, :uid, :description

          def id
            object.uid
          end
        end
      end
    end
  end
end
