#!/usr/bin/ruby

$LOAD_PATH.push(File.dirname(__FILE__))

require 'json'
require 'sinatra'
require 'sinatra/reloader'

require ',config'

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
    posts = glob("#{CONFIG[:jekyll_base_path]}/_posts", '*.md')
    drafts = glob("#{CONFIG[:jekyll_base_path]}/_drafts", '/*.md')
    JSON.dump({
        ok: true,
        posts: posts,
        drafts: drafts,
      })
  else
    $stderr.puts "Invalid action: #{action}"
    status 400
  end
end
