@echo off

set name=%1
set coffee=%name%.coffee
set tmpl=%name%.tmpl
set css=%name%.css

mkdir "src/ebaui.web/"%name%
cd "src/ebaui.web/"%name%

rem.>%coffee%
rem.>%tmpl%
rem.>%css%

cd "../../.."