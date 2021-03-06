
SELENIUMJAR=selenium-server-standalone-2.39.0.jar
SELENIUMPID=$(shell ps -ef | grep  'selenium-server-standalone-2.39.0.jar$$' | cut -d ' ' -f 2-3)
APPPID=$(shell ps -ef | grep  'node app.js$$' | cut -d ' ' -f 2-3)

all: test

$(SELENIUMJAR):
	@echo "Getting selenium server $(SELENIUMJAR) ..."
	curl -O http://selenium.googlecode.com/files/$(SELENIUMJAR)

launchselenium: $(SELENIUMJAR)
ifneq (,$(SELENIUMPID))
	@echo "Selenium server $(SELENIUMJAR) is already running. Process id: $(SELENIUMPID)"
else
	@echo "Starting selenium server $(SELENIUMJAR) ..."
	java -jar $(SELENIUMJAR) &

endif

launchapp:
ifneq (,$(APPPID))
	@echo "node app.js is already running. Process id: $(APPPID)"
else
	@echo "Starting node app.js ..."
	node app.js &
endif

test: launchselenium launchapp
	npm test


.PHONY: all test launchapp launchselenium
