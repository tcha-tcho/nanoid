site:
	rm -fr /tmp/docs \
	  && cp -fr docs /tmp/docs \
	  && git checkout gh-pages \
  	&& cp -fr /tmp/docs/* ./docs \
		&& echo "done"


test:
ifeq ($(file),)
	@echo "Also use file /specs/..."
	@echo "Starting..."
	mocha specs/* --reporter spec --require should --ignore-leaks --timeout 50000
else
	@echo "Starting..."
	mocha $(file) --reporter spec --require should --ignore-leaks --timeout 50000
endif


.PHONY: site
