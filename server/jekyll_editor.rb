#!/usr/bin/ruby

#$LOAD_PATH.push(File.dirname(__FILE__))

require 'json'
require 'kramdown'

require ',config'


POSTS_PATH = "#{CONFIG[:jekyll_base_path]}/_posts"
DRAFTS_PATH = "#{CONFIG[:jekyll_base_path]}/_drafts"

def glob(path, pattern)
  Dir.glob("#{path}/#{pattern}").map do |file|
    file.sub(%r!^#{path}/!, '')
  end
end

class JekyllEditor
  def get_list
    posts = glob(POSTS_PATH, '*.md')
    drafts = glob(DRAFTS_PATH, '/*.md')
    JSON.dump({
        ok: true,
        posts: posts,
        drafts: drafts,
      })
  end

  def get_post(file)
    path = "#{POSTS_PATH}/#{file}"
    contents = File.read(path)
    JSON.dump({
        ok: true,
        contents: contents,
        html: Kramdown::Document.new(contents).to_html,
      })
  end

  def put_post(file, contents)
    open("#{POSTS_PATH}/#{file}", 'w') do |f|
      f.write(contents)
    end
    JSON.dump({
        ok: true,
        html: Kramdown::Document.new(contents).to_html,
      })
  end
end
