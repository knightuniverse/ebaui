cd /d "F:\Work\PJ\hiap\ui-works\ebaui\"

svn up

cd /d "F:\Work\PJ\hiap\hiap-ebaui\trunk"

xcopy /y "F:\Work\PJ\hiap\ui-works\ebaui\templates\fonts\*" "F:\Work\PJ\hiap\hiap-ebaui\trunk\src\css\fonts"

copy /y "F:\Work\PJ\hiap\ui-works\ebaui\templates\ebaui.css" "F:\Work\PJ\hiap\hiap-ebaui\trunk\src\css\ebaui.css"