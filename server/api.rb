#!/usr/bin/env ruby -Ku
# -*- coding: utf-8 -*-

$LOAD_PATH.push(File.dirname(__FILE__))

#require 'cgi'

require "#{File.dirname(__FILE__)}/jekyll_editor"

#ENV['REQUEST_METHOD'] = 'GET'
#ENV['QUERY_STRING'] = 'action=post&file=2015-11-24-mathjax.md'

class MyCgi
  attr_reader :method, :params, :body

  def initialize
    @method = (ENV['REQUEST_METHOD'] || 'GET').upcase
    @params = get_params_from_query_string
    @body = read_body($stdin)
    @headers = {}
  end

  def set_headers(h)
    @headers = h
  end

  def out(&block)
    body = block.call

    @headers['Content-Length'] = body.bytesize
    unless @headers.has_key?('Status')
      @headers['Status'] = 200
    end

    headers = @headers.map{|k, v| "#{k}: #{v}"}

    $stdout.set_encoding('UTF-8')
    $stdout.print <<EOD
#{headers.join("\n")}

EOD
    $stdout.print body
  end

  def get_params_from_query_string
    h = {}
    if ENV['QUERY_STRING']
      ENV['QUERY_STRING'].split('&').each do |q|
        key, value = q.split('=', 2)
        h[key] = value
      end
    end
    return h
  end

  def read_body(f)
    lines = []
    while f.gets
      lines.push($_)
    end
    return lines.join('')
  end
end

def main
  je = JekyllEditor.new
  ex = nil

  cgi = MyCgi.new
  case cgi.method
  when 'GET'
    case cgi.params['action']
    when 'list'
      cgi.set_headers({
          'Content-Type' => 'text/json',
        })
      return cgi.out { je.get_list }
    when 'post'
      file = cgi.params['file']
      contents = File.read("#{POSTS_PATH}/#{file}")
      cgi.set_headers({
          'Content-Type' => 'text/json',
          'Status' => 200,
        })
      return cgi.out { je.get_post(file) }
    end

  when 'PUT'
    case cgi.params['action']
    when 'post'
      file = cgi.params['file']
      contents = cgi.body
      result = je.put_post(file, contents)
      cgi.set_headers({
          'Content-Type' => 'text/json',
          'Status' => 200,
        })
      return cgi.out { result }
    end
  end

  cgi.set_headers({
      'Content-Type' => 'text/json',
      'Status' => 404,
    })
  return cgi.out { JSON.dump({
        method: 'PUT',
        params: cgi.params,
        body: cgi.body,
        ex: ex ? ex.inspect : '',
      })
  }
end

main
