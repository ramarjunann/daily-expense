module Commutatus
  class User < ApplicationRecord
    devise :database_authenticatable, :recoverable, :trackable, :validatable

    include UniqueIdentityGenerator

    # Callbacks
    # =========
    before_create :generate_auth_token
    before_create :set_auth_token_expiry

    # associations
    has_many :incomes, dependent: :destroy
    has_many :expenses, dependent: :destroy



    def generate_auth_token
      self.auth_token = loop do
        unique_auth_token = SecureRandom.hex(25)

        break unique_auth_token unless self.class.exists?(auth_token: unique_auth_token)
      end
    end

    # Sets auth token expiry date
    def set_auth_token_expiry
      self.auth_token_expires_at = (Time.zone.now + 30.days)
    end

    # auth token should match with one in database and it should not be expired
    def valid_auth_token?(request_auth_token)
      Devise.secure_compare(auth_token, request_auth_token) && !auth_token_expired?
    end

    def auth_token_expired?
      if Time.zone.now > auth_token_expires_at
        regenerate_auth_token!
      else
        false
      end
    end

    # Sets new auth token and expiry date for the user.
    def regenerate_auth_token!
      generate_auth_token
      set_auth_token_expiry

      save
    end

  end
end
