

all: ejdb;


ejdb: node_modules
	test -d node_modules/ejdb || npm install ejdb
	test -d node_modules/ejdb && npm update ejdb

node_modules:
	mkdir -p node_modules

clean:
	rm -rf node_modules


.PHONY: all ejdb
