@echo off
config && grunt && grunt coffee:release coffee:tmpl concat copy:release --stack