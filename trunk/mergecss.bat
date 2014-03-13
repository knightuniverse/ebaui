cd /d "E:\pj\uiworks\ebaui\templates\"

svn up

cd /d "E:\pj\hiap-ebaui\trunk\"

xcopy /y "E:\pj\uiworks\ebaui\templates\fonts\*" "E:\pj\hiap-ebaui\trunk\src\css\fonts"

copy /y "E:\pj\uiworks\ebaui\templates\eba.ui.1.0_default.css" "E:\pj\hiap-ebaui\trunk\src\css\ebaui.css"