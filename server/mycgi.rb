#!/usr/bin/env ruby -Ku
# -*- coding: utf-8 -*-

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
