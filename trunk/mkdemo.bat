@echo off
SETLOCAL enabledelayedexpansion

set name=%1

mkdir "demo\%name%\"

rem.>"demo\%name%\index.cake"
copy /Y "demo\res.inc" "demo\%name%\res.inc"
copy /Y "demo\a.layout" "demo\%name%\a.layout"

cd ..