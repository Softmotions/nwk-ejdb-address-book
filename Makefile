ifeq ($(TARGET),)
  TARGET=`node -v`
endif

all: ejdb;

ejdb: node_modules
	test -d node_modules/ejdb || npm install ejdb
	test -d node_modules/ejdb && npm update ejdb
	cd node_modules/ejdb && nw-gyp configure --target=$(TARGET)
	cd node_modules/ejdb && nw-gyp build

node_modules:
	mkdir -p node_modules

clean:
	rm -rf node_modules

.PHONY: all ejdb

