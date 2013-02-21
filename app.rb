require 'sinatra'
require "sinatra/json"
require 'mongoid'

Mongoid.load!('./mongoid.yml', :development)

class Todo
  include Mongoid::Document
  
  field :message
  field :done

  def to_json
    { 
      todoId: self._id,
      message: self.message,
      done: self.done
    }
  end
end


get '/' do
  erb :index
end

# List
#
get '/todos' do
  json Todo.all.map{|todo| todo.to_json}, :encoder => :to_json, :content_type => :js
end

# Create
#
post '/todos' do
  todoParse = JSON.parse(request.body.read.to_s)
  todo = Todo.create(message: todoParse["message"], done: todoParse["done"])

  json todo.to_json, :encoder => :to_json, :content_type => :js
end

# Update
#
post '/todos/:id' do
  todoParse = JSON.parse(request.body.read.to_s)
  todo = Todo.find(params[:id])
  todo.message = todoParse["message"]
  todo.done = todoParse["done"]
  todo.save

  json todo.to_json, :encoder => :to_json, :content_type => :js
end

# Delete
#
delete '/todos/:id' do
  todo = Todo.find(params[:id])
  todo.delete

  json 'ok'.to_json, :encoder => :to_json, :content_type => :js
end
