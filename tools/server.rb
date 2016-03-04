#!/usr/bin/ruby

$LOAD_PATH.push(File.dirname(__FILE__))

require 'json'
require 'sinatra'
require 'sinatra/reloader'

require ',config'

def glob(path, pattern)
  Dir.glob("#{path}/#{pattern}").map do |file|
    p file
    file.sub(%r!^#{path}/!, '')
  end
end

set :public_folder, 'public'

get '/' do
  redirect './index.html'
end

get '/api' do
  posts = glob("#{CONFIG[:jekyll_base_path]}/_posts", '*.md')
  drafts = glob("#{CONFIG[:jekyll_base_path]}/_drafts", '/*.md')
  JSON.dump({
      ok: true,
      posts: posts,
      drafts: drafts,
    })
end
