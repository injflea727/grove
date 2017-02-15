#!/usr/bin/env ruby

# Simple preprocessor that replaces lines like
#
#   #include foo.txt
#
# with the contents of the referenced file.
# Operates on STDIN.
#
# Usage:
#   ./resolve_includes < src/index.html.template

def resolve_includes(file, &block)
  while line = file.gets
    line = line.chomp
    if line.start_with? '#include '
      filename = line[9..-1]
      resolve_includes File.open(filename, 'r'), &block
    else
      yield line
    end
  end
end

resolve_includes STDIN do |each_line|
  puts each_line
end
