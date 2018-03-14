require 'grape-swagger'
require 'cancancan'

module Commutatus
  module API
    class Root < Grape::API
      format :json
      prefix :api
      version 'v1', using: :path
      formatter :json, Grape::Formatter::ActiveModelSerializers

      helpers V1::Helper::Authentication

      # Handle missing parameters
      # HTTP status code: 400
      rescue_from Grape::Exceptions::ValidationErrors do |exception|
        Rack::Response.new(
            [{status: 'error', errors: exception.message.split(', ')}.to_json],
            exception.status,
            {'Content-Type' => 'application/json'}
        ).finish
      end

      # Handle resource not found
      # HTTP status code 404
      rescue_from ActiveRecord::RecordNotFound do |exception|
        Rails.logger.error "Resource not found error: #{exception.message}"
        Rack::Response.new(
            [{status: 'error', errors: [exception.message]}.to_json],
            404,
            {'Content-Type' => 'application/json'}
        ).finish
      end

      rescue_from ::CanCan::AccessDenied do |exception|
        Rails.logger.error "Permission violated: #{exception.message}"

        Rack::Response.new(
            [{status: 'error', errors: ['Access denied']}.to_json],
            403,
            {'Content-Type' => 'application/json'}
        ).finish
      end

      # Handle internal server error
      # HTTP status code 500
      rescue_from Exception do |exception|
        Rails.logger.error "Internal server error: #{exception.message}"
        Rails.logger.error exception.backtrace.join("\n")

        Rack::Response.new(
            [{status: 'error', errors: [exception.message]}.to_json],
            500,
            {'Content-Type' => 'application/json'}
        ).finish
      end

      mount V1::User
      mount V1::Income
      mount V1::Expense


      add_swagger_documentation hide_documentation_path: true, api_version: 'v1'
    end
  end
end
