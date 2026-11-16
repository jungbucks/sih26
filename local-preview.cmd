@echo off
rem sih26 local preview server - close this window to stop it.
cd /d "%~dp0"
node scripts\local.mjs
pause
