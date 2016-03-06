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
    @method = (ENV['REQUEST_METHOD'] || 'GET').downcase.intern
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
  def run_jekyll_editor(req, res)
    je = JekyllEditor.new
    if je.respond_to?(req.method)
      je.send(req.method, req, res)
    else
      res.headers({
          'Content-Type' => 'text/json',
          'Status' => 400,
        })
      res.out(JSON.dump({
            params: cgi.params,
            body: cgi.body,
            ex: ex ? ex.inspect : '',
          }))
    end
  end

  cgi = MyCgi.new
  req = MyRequest.new(cgi.method, cgi.params, cgi.body)
  res = MyResponse.new
  begin
    run_jekyll_editor(req, res)
    cgi.set_headers(res.headers)
    return cgi.out { res.to_s }
  rescue => ex
    cgi.set_headers({
      'Status' => '500 Exception occurred',
      'Content-Type' => 'text/json',
    })
    cgi.out(JSON.dump({
          ok: false,
          ex: ex.inspect,
        }))
  end
end

main
