source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

ruby "2.4.2"
gem 'rails', '~> 5.1.5'
gem 'pg', '>= 0.18', '< 2.0'
gem 'puma', '~> 3.7'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.2'
gem 'turbolinks', '~> 5'
gem 'jbuilder', '~> 2.5'

# API
# ----
gem 'grape'
gem 'grape-swagger'
gem 'grape-swagger-rails'
gem 'grape-middleware-logger'
gem 'grape-active_model_serializers'
gem 'grape-cancan'
gem 'hashie-forbidden_attributes'
gem 'rack-cors'
gem 'rest-client'

# View
# -----
gem 'haml'

#Authentication
# -------------
gem 'devise'

# Authorization
# -------------
gem 'rolify'

# Pagination
# ----------
gem 'kaminari'

group :development, :test do
  gem 'rspec-rails'
  gem 'factory_bot_rails'
  gem 'faker'
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
end

group :development do
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
end

gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
