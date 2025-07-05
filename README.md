```bash

# list devices
adb devices

# push file to device
adb push '/Users/srikanthvudharapu/Downloads/gemma-3n-E2B-it-int4.task' /sdcard/Android/data/io.ionic.starter/files/

# for specific device
adb -s 6f4b3f2a0121 push '/Users/srikanthvudharapu/Downloads/gemma-3n-E2B-it-int4.task' /sdcard/Android/data/io.ionic.starter/files/

# if the folder doesn't exist, create it
adb -s 6f4b3f2a0121 shell mkdir -p /sdcard/Android/data/io.ionic.starter/files/

# uninstall existing app
adb -s 6f4b3f2a0121 uninstall io.ionic.starter

# install new app
adb -s 6f4b3f2a0121 install '/Users/srikanthvudharapu/Desktop/work/poc/28.gemma-3n/test-gemma--one/android/app/build/outputs/apk/debug/app-debug.apk'

# single line command:
adb -s 6f4b3f2a0121 uninstall io.ionic.starter && \
adb -s 6f4b3f2a0121 shell mkdir -p /sdcard/Android/data/io.ionic.starter/files/ && \
adb -s 6f4b3f2a0121 push '/Users/srikanthvudharapu/Downloads/gemma-3n-E2B-it-int4.task' /sdcard/Android/data/io.ionic.starter/files/ && \
adb -s 6f4b3f2a0121 install '/Users/srikanthvudharapu/Desktop/work/poc/28.gemma-3n/test-gemma--one/android/app/build/outputs/apk/debug/app-debug.apk' 


# logcat
adb -s 6f4b3f2a0121 logcat | grep GemmaLLM
# or
adb -s 6f4b3f2a0121 logcat -s GemmaLLM

# list packages
adb -s 6f4b3f2a0121 shell pm list packages

# list packages containing io.ionic.starter
adb -s 6f4b3f2a0121 shell pm list packages | grep io.ionic.starter

# list packages containing io.ionic.starter and cut the package name
adb -s 6f4b3f2a0121 shell pm list packages | grep io.ionic.starter | cut -d ':' -f 2

# uninstall existing app
adb -s 6f4b3f2a0121 shell pm list packages | grep io.ionic.starter | cut -d ':' -f 2 | xargs adb -s 6f4b3f2a0121 shell pm uninstall -k --user 0
```


plugins located at: `ll -R android/app/src/main/java`


https://github.com/google-ai-edge/mediapipe-samples/blob/8e3c8cea4c56304267df70b69045767308c9a0d4/examples/llm_inference/android/app/src/main/java/com/google/mediapipe/examples/llminference/InferenceModel.kt#L58