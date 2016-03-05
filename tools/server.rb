#!/usr/bin/ruby

$LOAD_PATH.push(File.dirname(__FILE__))

require 'json'
require 'kramdown'
require 'sinatra'
require 'sinatra/reloader'

require ',config'

POSTS_PATH = "#{CONFIG[:jekyll_base_path]}/_posts"
DRAFTS_PATH = "#{CONFIG[:jekyll_base_path]}/_drafts"

def glob(path, pattern)
  Dir.glob("#{path}/#{pattern}").map do |file|
    file.sub(%r!^#{path}/!, '')
  end
end

set :public_folder, 'public'

get '/' do
  redirect './index.html'
end

get '/api.rb' do
  action = params[:action]

  case action
  when 'list'
    posts = glob(POSTS_PATH, '*.md')
    drafts = glob(DRAFTS_PATH, '/*.md')
    JSON.dump({
        ok: true,
        posts: posts,
        drafts: drafts,
      })
  when 'post'
    file = params[:file]
    path = "#{POSTS_PATH}/#{file}"
    contents = File.read(path)
    JSON.dump({
        ok: true,
        contents: contents,
        html: Kramdown::Document.new(contents).to_html,
      })
  else
    $stderr.puts "Invalid action: #{action}"
    status 400
  end
end

put '/api' do
  body = JSON.parse(request.body.read)
  case params[:action]
  when 'post'
    file = params[:file]
    contents = body['contents']
    begin
      open("#{POSTS_PATH}/#{file}", 'w') do |f|
        f.write(contents)
      end
      JSON.dump({
          ok: true,
          html: Kramdown::Document.new(contents).to_html,
        })
    rescue => ex
      status 500
      ex
    end
  else
    status 500
  end
end
