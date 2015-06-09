nwk-ejdb-address-book
=====================

Simple demo address book implemented with [EJDB](https://github.com/Softmotions/ejdb) 
and [nw.js](https://github.com/nwjs/nw.js)

Installation (linux/osx):

 1. Install [node-webkit](https://github.com/nwjs/nw.js) 
 The `nw` command should be available.
 
 ```js
 npm install nw
 ```
 
 2. `git clone https://github.com/Softmotions/nwk-ejdb-address-book.git`
 3. Then `cd ./nwk-ejdb-address-book` and run`make`
 If you got error like this:
 
 ```sh
 gyp http GET http://node-webkit.s3.amazonaws.com/v0.12.4/nw-headers-v0.12.4.tar.gz
 gyp http 404 http://node-webkit.s3.amazonaws.com/v0.12.4/nw-headers-v0.12.4.tar.gz
 gyp WARN install got an error, rolling back install
 gyp ERR! configure error 
 gyp ERR! stack Error: 404 status code downloading tarball
 ...
```

 Try to use following nodejs version arguments for `nw-gyp`:
    
 * `make TARGET=v0.12.2` if you have nodejs `v0.12.x`
 * `make TARGET=v0.10.5` if you have nodejs `v0.10.x`

 4. Then run addressbook application: `nw` in the `nwk-ejdb-address-book` directory.
