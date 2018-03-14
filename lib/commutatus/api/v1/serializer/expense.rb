module Commutatus
  module API
    module V1
      module Serializer
        class Expense < ActiveModel::Serializer
          attributes :id, :user_id, :amount, :category, :uid, :description

          def id
            object.uid
          end

        end
      end
    end
  end
end
