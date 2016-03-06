#!/usr/bin/ruby

$LOAD_PATH.push(File.dirname(__FILE__))

require 'sinatra/base'
require 'sinatra/reloader'

require 'jekyll_editor'

class SinatraDevServer < Sinatra::Base
  configure do
    register Sinatra::Reloader
  end

  set :public_folder, 'public'

  get '/' do
    redirect './index.html'
  end

  get '/api.rb' do
    req = MyRequest.new(:get, params)
    res = MyResponse.new
    JekyllEditor.new.get(req, res)

    headers(res.headers)
    res.to_s
  end

  put '/api.rb' do
    body = request.body.set_encoding('UTF-8').read
    req = MyRequest.new(:put, params, body)
    res = MyResponse.new
    JekyllEditor.new.put(req, res)

    headers(res.headers)
    res.to_s
  end
end

if $0 == __FILE__
  SinatraDevServer.run!
end
