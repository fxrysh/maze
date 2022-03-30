#!/bin/sh

(echo; exec inotifywait -rme close_write ./index.wat) |
while read; do
	date;
	wat2wasm index.wat -o index.wasm;
done
