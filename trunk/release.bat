@echo off
config && grunt && grunt coffee:release coffee:tmpl concat copy:release uglify:release cssmin:release compress:release --stack