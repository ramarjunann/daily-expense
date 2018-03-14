module Commutatus
  module UniqueIdentityGenerator
    extend ActiveSupport::Concern

    included do
      before_create :generate_uid
    end

    # Instance Methods
    # ================
    def generate_uid
      self.uid = loop do
        random_uid = SecureRandom.hex(4)

        break random_uid unless self.class.exists?(uid: random_uid)
      end
    end
  end
end
