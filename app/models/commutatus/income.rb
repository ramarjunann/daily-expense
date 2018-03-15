module Commutatus
  class Income < ApplicationRecord
    include UniqueIdentityGenerator

    # Validations
    # ===========
    validates :description, presence: true
    validates :amount, numericality: true


    # Associations
    # ============
    belongs_to :user, inverse_of: :incomes
  end
end
