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

####

class JekyllEditor
  def get(req, res)
    case req.params['action']
    when 'list'
      get_list(req, res)
    when 'post'
      get_post(req, res)
    else
      res.status(400)
      res.out('Bad action')
    end
  end

  def put(req, res)
    case req.params['action']
    when 'post'
      put_post(req, res)
    else
      res.status(400)
      res.out('Bad action')
    end
  end

  def get_list(req, res)
    posts = glob(POSTS_PATH, '*.md')
    drafts = glob(DRAFTS_PATH, '/*.md')
    res.headers = {
      'Status' => '200 OK',
      'Content-Type' => 'text/json',
    }
    res.out(JSON.dump({
          ok: true,
          posts: posts,
          drafts: drafts,
        }))
  end

  def get_post(req, res)
    path = "#{POSTS_PATH}/#{req.params['file']}"
    contents = File.read(path)
    res.headers = {
      'Status' => '200 OK',
      'Content-Type' => 'text/json',
    }
    res.out(JSON.dump({
          ok: true,
          contents: contents,
          html: Kramdown::Document.new(contents).to_html,
        }))
  end

  def put_post(req, res)
    open("#{POSTS_PATH}/#{req.params['file']}", 'w') do |f|
      f.write(req.body)
    end
    res.headers = {
      'Status' => '200 OK',
      'Content-Type' => 'text/json',
    }
    res.out(JSON.dump({
          ok: true,
          html: Kramdown::Document.new(req.body).to_html,
        }))
  end
end

####

class MyRequest
  attr_reader :method, :params, :body

  def initialize(method, params, body = nil)
    @method = method
    @params = params
    @body = body
  end

  def run
    "RUN method=#{@method}, params=#{@params.inspect}"
  end
end

class MyResponse
  attr_accessor :headers

  def initialize
    @headers = {}
    @result = nil
  end

  def out(result)
    @result = result
    @headers['Content-Length'] = result.bytesize
  end

  def status(value = nil)
    if value
      return @headers['Status'] = value
    end
    @headers['Status'] || 200
  end

  def to_s
    "#{@result}"
  end
end
