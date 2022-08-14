require 'sinatra'

before '/' do
  content_type 'text/html'
end

get '/' do
  erb :index
end