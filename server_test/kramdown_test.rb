require "./#{File.dirname(__FILE__)}/../server/jekyll_editor"

print convert_markdown_to_html('hoge')

print convert_markdown_to_html(<<EOD)
```rb
10.times do |i|
  puts i
end
```

```rb
20.times do |i|
  puts i
end
```
EOD

print convert_markdown_to_html(<<EOD)
Inline: $$F = ma$$

Block:

$$
E = mc^2
$$
```
EOD
