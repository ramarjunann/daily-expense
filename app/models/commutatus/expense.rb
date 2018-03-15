module Commutatus
  class Expense < ApplicationRecord
    include UniqueIdentityGenerator

    # Attributes
    # ==========
    enum category: {
      food: 0,
      transport: 1,
      bills: 2,
      loans: 3,
      savings: 4,
      clothes: 5,
      health: 6,
      households: 7,
      education: 8,
      gifts: 9
    }

    # Validations
    # ===========
    validates :description, :category, presence: true
    validates :amount, numericality: true


    # Associations
    # ============
    belongs_to :user, inverse_of: :expenses

  end
end
