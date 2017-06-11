.PHONY: start-emulators deploy-status deploy-chatbot

start-emulators:
	@echo "Starting Android emulators..."
	$(ANDROID_HOME)/tools/emulator -avd Peter  > /dev/null 2> /dev/null &
	$(ANDROID_HOME)/tools/emulator -avd Jarrad > /dev/null 2> /dev/null &
	$(ANDROID_HOME)/tools/emulator -avd Alex   > /dev/null 2> /dev/null &

deploy-status:
	@echo "Starting Android emulators..."
	$(ANDROID_HOME)/platform-tools/adb -s emulator-5554 install $(APK)
	$(ANDROID_HOME)/platform-tools/adb -s emulator-5556 install $(APK)
	$(ANDROID_HOME)/platform-tools/adb -s emulator-5558 install $(APK)

deploy-chatbot:
	http-server &

	@echo "Deploying chat-bot to Status emulators..."
	$(ANDROID_HOME)/platform-tools/adb -s emulator-5554 forward tcp:5561 tcp:5561
	$(ANDROID_HOME)/platform-tools/adb -s emulator-5554 reverse tcp:8080 tcp:8080
	status-dev-cli remove favor --ip localhost
	status-dev-cli add '{"whisper-identity": "favor",  "name": "Favor Network" ,"bot-url": "http://127.0.0.1:8080/statusbot.js", "photo-path":"http://favor.network/statusbot.png"}' --ip localhost

	$(ANDROID_HOME)/platform-tools/adb -s emulator-5556 forward tcp:5561 tcp:5561
	$(ANDROID_HOME)/platform-tools/adb -s emulator-5556 reverse tcp:8080 tcp:8080
	status-dev-cli remove favor --ip localhost
	status-dev-cli add '{"whisper-identity": "favor",  "name": "Favor Network" ,"bot-url": "http://127.0.0.1:8080/statusbot.js", "photo-path":"http://favor.network/statusbot.png"}' --ip localhost

	$(ANDROID_HOME)/platform-tools/adb -s emulator-5558 forward tcp:5561 tcp:5561
	$(ANDROID_HOME)/platform-tools/adb -s emulator-5558 reverse tcp:8080 tcp:8080
	status-dev-cli remove favor --ip localhost
	status-dev-cli add '{"whisper-identity": "favor",  "name": "Favor Network" ,"bot-url": "http://127.0.0.1:8080/statusbot.js", "photo-path":"http://favor.network/statusbot.png"}' --ip localhost

	killall node
