#!/usr/bin/env ruby -Ku

require 'fileutils'
require 'json'
require 'kramdown'
require 'rouge'
require 'time'
require 'yaml'

require "#{File.dirname(__FILE__)}/,config"

POSTS_PATH = "#{CONFIG[:jekyll_base_path]}/_posts"
DRAFTS_PATH = "#{CONFIG[:jekyll_base_path]}/_drafts"

def glob(path, pattern)
  if pattern.is_a?(String)
    pattern = pattern.split("\0")
  end

  Dir.glob(pattern.map {|pat| "#{path}/#{pat}"}).map do |file|
    file.sub(%r!^#{path}/!, '')
  end
end

def convert_markdown_to_html(contents)
  Kramdown::Document.new(contents, {
      syntax_highlighter: 'rouge',
      syntax_highlighter_opts: {
        default_lang: 'ruby',
        formatter: Rouge::Formatters::HTML,
        'bold_every' => 8, 'css' => :class
      },

      'auto_ids'       => true,
      'toc_levels'     => '1..6',
      'entity_output'  => 'as_char',
      'smart_quotes'   => 'lsquo,rsquo,ldquo,rdquo',
      'input'          => "GFM",
      'hard_wrap'      => false,
      'footnote_nr'    => 1,
    }).to_html
end

def read_jekyll_front_matter(fn, read_contents = false)
  open(fn) do |f|
    line = f.gets
    unless line =~ /^-{2,}$/
      return {}
    end

    lines = []
    while true
      line = f.gets
      if !line || line =~ /^-{2,}$/
        break
      end
      lines.push(line)
    end

    h = YAML.load(lines.join)
    unless h.has_key?('date')
      if File.basename(fn) =~ /^((\d+)-(\d+)-(\d+))/
        h['date'] = Time.new($2.to_i, $3.to_i, $4.to_i)
      end
    end
    unless read_contents
      return h
    end

    lines = f.read().split("\n")
    if !lines.empty? && lines[0] == ''
      lines.shift  # Drop first empty line.
    end

    return h, lines.join("\n")
  end
end

def read_front_matters(posts, path)
  posts.map do |fn|
    h = read_jekyll_front_matter("#{path}/#{fn}")
    h['file'] = fn
    if h['date'].is_a?(Date)
      d = h['date']
      h['date'] = Time.new(d.year, d.month, d.day)
    end
    h
  end.sort_by! {|post| post['date']}.reverse!
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
      res.status('400 Bad Request')
      res.out('Bad Request (illegal action)')
    end
  end

  def put(req, res)
    case req.params['action']
    when 'post'
      put_post(req, res)
    else
      res.status('400 Bad Request')
      res.out('Bad Request (illegal action)')
    end
  end

  def delete(req, res)
    case req.params['action']
    when 'post'
      delete_post(req, res)
    else
      res.status('400 Bad Request')
      res.out('Bad Request (illegal action)')
    end
  end

  def get_list(req, res)
    posts = read_front_matters(glob(POSTS_PATH, ['*.md', '*.markdown']), POSTS_PATH)
    res.headers = {
      'Status' => '200 OK',
      'Content-Type' => 'text/json; charset=utf-8',
    }
    res.out(JSON.dump({
          ok: true,
          posts: posts,
        }))
  end

  def get_post(req, res)
    path = "#{POSTS_PATH}/#{req.params['file']}"
    unless File.exists?(path)
      res.headers = {
        'Status' => '404 Not Found',
        'Content-Type' => 'text/json',
      }
      res.out(JSON.dump({
            ok: false,
            file: req.params['file'],
          }))
      return
    end

    info, contents = read_jekyll_front_matter("#{POSTS_PATH}/#{req.params['file']}", true)
    res.headers = {
      'Status' => '200 OK',
      'Content-Type' => 'text/json; charset=utf-8',
    }
    res.out(JSON.dump({
          ok: true,
          info: info,
          contents: contents,
          html: convert_markdown_to_html(contents),
        }))
  end

  def put_post(req, res)
    json = JSON.parse(req.body)
    front_matters = json['info']
    front_matters['date'] = Time.parse(front_matters['date'])

    if req.params['originalFileName']
      FileUtils.rm("#{POSTS_PATH}/#{req.params['originalFileName']}")
    end

    file = req.params['file']
    unless file  # New file
      file = "#{front_matters['date'].strftime('%Y-%m-%d')}-#{Time.now.to_i.to_s}.md"
    end

    contents = json['contents'] || ''
    out_path = "#{POSTS_PATH}/#{file}"
    open(out_path, 'w', 0777) do |f|
      f.write(%!\
#{front_matters.to_yaml}\
---

#{contents}!)
    end
    res.headers = {
      'Status' => '200 OK',
      'Content-Type' => 'text/json',
    }
    res.out(JSON.dump({
          ok: true,
          file: file,
          html: convert_markdown_to_html(contents),
        }))
  end

  def delete_post(req, res)
    File.delete("#{POSTS_PATH}/#{req.params['file']}")
    res.headers = {
      'Status' => '200 OK',
      'Content-Type' => 'text/json',
    }
    res.out(JSON.dump({
          ok: true,
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
    @headers['Status'] ||= '200 OK'
  end

  def to_s
    "#{@result}"
  end
end
