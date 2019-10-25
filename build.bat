@call ionic cordova build android --prod --release
@call jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore platforms\android\app\build\outputs\apk\release\my-release-key.keystore "platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk" alias_name
@IF EXIST EkoApp.old.apk del EkoApp.old.apk
@IF EXIST EkoApp.apk move EkoApp.apk EkoApp.old.apk
@call %ANDROID_HOME%\build-tools\29.0.2\zipalign -v 4 platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk EkoApp.apk
@pause