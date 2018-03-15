module Commutatus
  module API
    module V1
      module Serializer
        class Expense < ActiveModel::Serializer
          attributes :id, :user_id, :amount, :category, :uid, :description, :created_date

          def id
            object.uid
          end

          def created_date
            object.created_at.strftime('%m/%d/%y')
          end

        end
      end
    end
  end
end