#!/usr/bin/env ruby -Ku

$LOAD_PATH.push(File.dirname(__FILE__))

require 'sinatra/base'
require 'sinatra/reloader'
require 'sinatra/cross_origin'

load 'jekyll_editor.rb'

class SinatraDevServer < Sinatra::Base
  configure do
    register Sinatra::Reloader
    register Sinatra::CrossOrigin
    enable :cross_origin
    set :allow_origin, :any
    set :allow_methods, [:get, :put, :delete]
  end

  set :public_folder, 'public'

  options '*' do
    response.headers['Allow'] = 'HEAD,GET,PUT,POST,DELETE,OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept'
    #response.headers['Access-Control-Allow-Origin'] = '*'
    200
  end

  get '/' do
    redirect './index.html'
  end

  get '/api.rb' do
    run_jekyll_editor(:get)
  end

  put '/api.rb' do
    run_jekyll_editor(:put)
  end

  delete '/api.rb' do
    run_jekyll_editor(:delete)
  end

  def run_jekyll_editor(method)
    body = request.body.set_encoding('UTF-8').read
    req = MyRequest.new(method, params, body)
    res = MyResponse.new
    je = JekyllEditor.new
    if je.respond_to?(req.method)
      je.send(req.method, req, res)
      headers(res.headers)
      if res.headers.has_key?('Status')
        status(res.headers['Status'])
      end
      res.to_s
    else
      status(400)
      JSON.dump({
          params: req.params,
          body: req.body,
        })
    end
  end
end

if $0 == __FILE__
  SinatraDevServer.run!
end
