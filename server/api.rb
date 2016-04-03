#!/usr/bin/env ruby -Ku
# -*- coding: utf-8 -*-

require "#{File.dirname(__FILE__)}/jekyll_editor"
require "#{File.dirname(__FILE__)}/mycgi"

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
