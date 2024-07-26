@echo off
REM Fetch the app URL
heroku info -s | findstr "web_url" > tmp_url.txt
set /p APP_URL=<tmp_url.txt
set APP_URL=%APP_URL:web_url=%
REM Trim whitespace
set APP_URL=%APP_URL:~1,-1%

REM Set the ALLOWED_ORIGINS environment variable
heroku config:set ALLOWED_ORIGINS=%APP_URL%

REM Clean up
del tmp_url.txt