#!/usr/bin/ruby

$LOAD_PATH.push(File.dirname(__FILE__))

require 'sinatra'
require 'sinatra/reloader'

require 'jekyll_editor'

set :public_folder, 'public'

def main
  je = JekyllEditor.new

  get '/' do
    redirect './index.html'
  end

  get '/api.rb' do
    action = params[:action]

    case action
    when 'list'
      je.get_list
    when 'post'
      file = params[:file]
      je.get_post(file)
    else
      $stderr.puts "Invalid action: #{action}"
      status 400
    end
  end

  put '/api.rb' do
    case params[:action]
    when 'post'
      file = params[:file]
      contents = request.body.set_encoding('UTF-8').read
      begin
        result = je.put_post(file, contents)
        return result
      rescue => ex
        status 501
        ex.inspect
      end
    else
      status 500
    end
  end
end

main
