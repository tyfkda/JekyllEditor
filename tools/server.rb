#!/usr/bin/ruby

$LOAD_PATH.push(File.dirname(__FILE__))

require 'json'
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

get '/api' do
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
    JSON.dump({
        ok: true,
        contents: File.read(path)
      })
  else
    $stderr.puts "Invalid action: #{action}"
    status 400
  end
end
