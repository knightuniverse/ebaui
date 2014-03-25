(function() {
  var btn, buttonedit, calMTVMonthsTmpl, calMTVRootTmpl, calMTVYearsTmpl, calMVHeaderTmpl, calMVRootTmpl, calMVWeekTmpl, calRootTmpl, captcha, cblItemTmpl, cblRootTmpl, chbx, fileUperTmpl, hidden, label, lbx, lbxitem, mght, mgit, mgrt, password, pth, rlItemTmpl, rlRootTmpl, spn, tabContent, tabHeader, tabs, textarea, textbox, timespn, webui;

  webui = ebaui['web'];

  pth = "<div class=\"panel-head\">\n    <div class=\"caption\"><h5></h5></div>\n    <div class=\"action\"></div>\n</div>";

  webui.injectTmpl('Panel', '_headerTmpl', pth);

  btn = "<button type=\"button\" data-role=\"button\" data-ns=\"web.form\" class=\"eba-button\">\n    <span class=\"eba-button-text\"></span>\n</button>";

  webui.injectTmpl('Button', '_rootTmpl', btn);

  textbox = "<span data-role=\"textbox\" data-ns=\"web.form\" class=\"eba-textbox\">\n    <span class=\"eba-textbox-border\">\n        <input type=\"text\" class=\"eba-textbox-input\" autocomplete=\"off\"/>\n    </span>\n</span>";

  webui.injectTmpl('TextBox', '_rootTmpl', textbox);

  textarea = "<span data-role=\"textarea\" data-ns=\"web.form\" class=\"eba-textbox eba-textarea\">\n    <span class=\"eba-textbox-border\">\n        <textarea class=\"eba-textbox-input\" autocomplete=\"off\"></textarea>\n    </span>\n</span>";

  webui.injectTmpl('TextArea', '_rootTmpl', textarea);

  password = "<span data-role=\"password\" data-ns=\"web.form\" class=\"eba-textbox\">\n    <span class=\"eba-textbox-border\">\n        <input type=\"password\" class=\"eba-textbox-input\" autocomplete=\"off\"/>\n    </span>\n</span>";

  webui.injectTmpl('Password', '_rootTmpl', password);

  buttonedit = "<span data-role=\"buttonedit\" data-ns=\"web.form\" class=\"eba-buttonedit\">\n    <span class=\"eba-buttonedit-border\">\n        <input type=\"text\" class=\"eba-buttonedit-input\" autocomplete=\"off\" />\n        <span class=\"eba-buttonedit-buttons\">\n            <span class=\"eba-buttonedit-close\"><i class=\"icon-remove\"></i></span>\n            <span class=\"eba-buttonedit-button\"><i class=\"icon-caret-right\"></i></span>\n        </span>\n    </span>\n</span>";

  webui.injectTmpl('ButtonEdit', '_rootTmpl', buttonedit);

  captcha = "<span data-role=\"captcha\" data-ns=\"web.form\" class=\"eba-code\">\n  <span class=\"eba-textbox-border\">\n    <input type=\"text\" class=\"eba-textbox-input\" autocomplete=\"off\" placeholder=\"\">\n  </span>\n  <a href=\"javascript:;\" data-role=\"btn-reload\"><img class=\"eba-code-img\" src=\"images/code.png\"></a>\n</span>";

  webui.injectTmpl('Captcha', '_rootTmpl', captcha);

  lbx = "<div data-role=\"listbox\" data-ns=\"ebaui.web\" class=\"eba-listbox eba-listbox-hideCheckBox\">\n    <div class=\"eba-listbox-border\">\n        <div class=\"eba-listbox-header\" style=\"display: none;\"></div>\n        <div class=\"eba-listbox-view\">\n            <div class=\"eba-grid-rows-content\">\n                <table class=\"eba-listbox-items\" cellspacing=\"0\" cellpadding=\"0\">\n                    <tbody></tbody>\n                </table>\n            </div>\n        </div>\n\n    </div>\n    <div class=\"eba-errorIcon\"></div>\n</div>";

  webui.injectTmpl('ListBox', '_rootTmpl', lbx);

  lbxitem = "<% if( loading ) {%>\n\n<tr>\n    <td colspan=\"20\"><span class=\"eba-textboxlist-popup-noresult\">Loading...</span></td>\n</tr>\n\n<%} else if( !loading && dataItems.length == 0 ) { %>\n\n<tr>\n    <td colspan=\"20\"><span class=\"eba-textboxlist-popup-noresult\">No Result</span></td>\n</tr>\n\n<%} else { \n    for( var i = 0,n = dataItems.length; i<n; i++ ) {\n        var item = dataItems[i];\n        var itemSelected = false;\n\n        if( multi ){\n\n            for (var j = 0; j < selectedItems.length; j++) {\n                var selected = selectedItems[j];\n                itemSelected = ( selected[valueField] == item[valueField] );\n                if( itemSelected ){ break; }\n            };\n\n        }else{\n\n            itemSelected = selectedItems[valueField] == item[valueField];\n\n        }\n%>\n\n<tr class=\"eba-listbox-item <%= itemSelected ? 'eba-listbox-item-selected' : '' %>\" \n    title=\"<%=item[textField]%>\" \n    data-index=\"<%=i%>\" \n    data-value=\"<%=item[valueField]%>\" \n    data-text=\"<%=item[textField]%>\">\n    <td class=\"eba-listbox-checkbox\"><input type=\"checkbox\" value=\"<%=item[valueField]%>\" /></td>\n    <td><%=item[textField]%></td>\n</tr>\n\n<%}}%>";

  webui.injectTmpl('ListBox', '_itemTmpl', lbxitem);

  mgrt = "<div data-role=\"minigrid\" data-ns=\"web.form\" class=\"eba-listbox eba-listbox-showColumns eba-listbox-showcolumns\">\n  <div class=\"eba-listbox-border\">\n    <div class=\"eba-listbox-view\">\n      <div class=\"eba-listbox-header\">\n        <table class=\"eba-listbox-headerInner\" cellspacing=\"0\" cellpadding=\"0\"><tbody></tbody></table>\n      </div>\n      <div class=\"eba-grid-rows-content\">\n        <table class=\"eba-listbox-items\" cellspacing=\"0\" cellpadding=\"0\">\n          <tbody></tbody></table>\n      </div>\n    </div>\n  </div>\n</div>";

  mght = "<tr>\n    <td class=\"eba-listbox-checkbox\">\n        <input type=\"checkbox\" value=\"selectall\" />\n    </td>\n    <%\n    for (var i = 0,l = headers.length; i < l; i++) {\n        var item = headers[i];\n        var width = item[\"width\"] ? \"width:\" + item[\"width\"] + \"px;\" : \"\";\n    %>\n        <td style=\"<%=width%>\"><%=item[\"label\"]%></td>\n    <%}%>\n</tr>";

  mgit = "<%\nfor (var i = 0,l = rows.length; i < l; i++) {\n    var row = rows[i];\n%>\n<tr data-index=\"<%=i%>\" class=\"eba-listbox-item\">\n    <td class=\"eba-listbox-checkbox\">\n        <input type=\"checkbox\" value=\"<%=i%>\" />\n    </td>\n    <%\n    for (var j = 0,max = headers.length; j < max; j++) {\n        var header = headers[j];\n        var width = header[\"width\"] ? \"width:\" + header[\"width\"] + \"px;\" : \"\";\n    %>\n    <td style=\"<%=width%>\"><%=row[header[\"name\"]]%></td>\n    <%}%>\n</tr>\n<%}%>";

  webui.injectTmpl('MiniGrid', '_rootTmpl', mgrt);

  webui.injectTmpl('MiniGrid', '_headerTmpl', mght);

  webui.injectTmpl('MiniGrid', '_itemTmpl', mgit);

  chbx = "<span data-role=\"checkbox\" data-ns=\"web.form\" class=\"eba-checkbox\">\n  <input type=\"checkbox\" class=\"eba-checkbox-check\" />\n  <label></label>\n</span>";

  webui.injectTmpl('CheckBox', '_rootTmpl', chbx);

  cblRootTmpl = "<div data-role=\"checkboxlist\" data-ns=\"web.form\" class=\"eba-checkboxlist\">\n    <table class=\"eba-checkboxlist-table\" cellpadding=\"0\" cellspacing=\"1\">\n      <tbody>\n        <tr></tr>\n      </tbody>\n    </table>\n</div>";

  cblItemTmpl = "<%\nfor (var i = 0,l = dataItems.length; i < l; i++) {\n    var item = dataItems[i];\n    var val = item[valueField];\n    var txt = item[textField];\n    var chk = item[\"checked\"];\n    var inputID = controlID + val;\n%>\n<td class=\"eba-checkboxlist-td\">\n    <div class=\"eba-checkboxlist-item\">\n      <input \n        id=\"<%=inputID %>\"\n        type=\"checkbox\" \n        <%=chk ? 'checked=\"checked\"' : '' %> \n        value=\"<%=val%>\" \n        data-text=\"<%=txt%>\" <%= disabled ? 'disabled=\"disabled\"' : ''%> />\n        \n      <label for=\"<%= inputID %>\"><%=txt%></label>\n    </div>\n</td>\n<%}%>";

  webui.injectTmpl('CheckBoxList', '_rootTmpl', cblRootTmpl);

  webui.injectTmpl('CheckBoxList', '_itemTmpl', cblItemTmpl);

  rlRootTmpl = "<div data-role=\"radiolist\" data-ns=\"web.form\" class=\"eba-radiobuttonlist\">\n    <table class=\"eba-radiobuttonlist-table\" cellpadding=\"0\" cellspacing=\"1\">\n      <tbody>\n        <tr></tr>\n      </tbody>\n    </table>\n</div>";

  rlItemTmpl = "<%\nfor (var i = 0,l = dataItems.length; i < l; i++) {\n    var item = dataItems[i];\n    var val = item[valueField];\n    var txt = item[textField];\n    var chk = item[\"checked\"];\n    var inputID = controlID + val;\n%>\n<td class=\"eba-radiobuttonlist-td\">\n    <div class=\"eba-radiobuttonlist-item\">\n      <input \n        id=\"<%=inputID %>\"\n        name=\"<%=name %>\"\n        type=\"radio\" \n        value=\"<%=val%>\" \n        data-text=\"<%=txt%>\" />\n        \n      <label for=\"<%= inputID %>\"><%=txt%></label>\n    </div>\n</td>\n<%}%>";

  webui.injectTmpl('RadioList', '_rootTmpl', rlRootTmpl);

  webui.injectTmpl('RadioList', '_itemTmpl', rlItemTmpl);

  hidden = "<input data-role=\"hidden\" data-ns=\"web.form\" type=\"hidden\" />";

  webui.injectTmpl('Hidden', '_rootTmpl', hidden);

  label = "<label data-role=\"label\" data-ns=\"web.form\" class=\"eba-label\"></label>";

  webui.injectTmpl('Label', '_rootTmpl', label);

  spn = "<span data-ns=\"web.form\" data-role=\"spinner\" class=\"eba-buttonedit eba-timespinner\">\n    <span class=\"eba-buttonedit-border\">\n\n        <input type=\"text\" class=\"eba-buttonedit-input\" autocomplete=\"off\">\n\n        <span class=\"eba-buttonedit-buttons\">\n            <span class=\"eba-buttonedit-close\"></span>\n            <span class=\"eba-buttonedit-button\">\n                <span class=\"eba-buttonedit-up\"><i class=\"icon-caret-up\"></i></span>\n                <span class=\"eba-buttonedit-down\"><i class=\"icon-caret-down\"></i></span>\n            </span>\n        </span>\n\n    </span>\n</span>";

  webui.injectTmpl('Spinner', '_rootTmpl', spn);

  timespn = "<span data-ns=\"web.form\" data-role=\"timespinner\" class=\"eba-buttonedit eba-timespinner\">\n    <span class=\"eba-buttonedit-border\">\n        <input data-idx=\"0\" data-pos=\"hour\" type=\"text\" class=\"eba-buttonedit-input\" autocomplete=\"off\">\n        <span>\n            <span style=\"float:left;line-height:19px;\">:</span>\n            <input data-idx=\"1\" data-pos=\"minute\" type=\"text\" class=\"eba-buttonedit-input\" autocomplete=\"off\">\n        </span>\n        <span>\n            <span style=\"float:left;line-height:19px;\">:</span>\n            <input data-idx=\"2\" data-pos=\"second\" type=\"text\" class=\"eba-buttonedit-input\" autocomplete=\"off\">\n        </span>\n        <span class=\"eba-buttonedit-buttons\">\n            <span class=\"eba-buttonedit-close\"></span>\n            <span class=\"eba-buttonedit-button\">\n                <span class=\"eba-buttonedit-up\"><i class=\"icon-caret-up\"></i></span>\n                <span class=\"eba-buttonedit-down\"><i class=\"icon-caret-down\"></i></span>\n            </span>\n        </span>\n    </span>\n    <span class=\"eba-warnicon\" title=\"警告\"></span>\n</span>";

  webui.injectTmpl('TimeSpinner', '_rootTmpl', timespn);

  calMVRootTmpl = "<div data-role=\"mainview\">\n<table class=\"eba-calendar-view\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n  <tbody>\n    <!-- title -->\n    <tr data-inner-role=\"title\">\n      <td colspan=\"10\" class=\"eba-calendar-header\">\n        <div class=\"eba-calendar-headerInner\">\n          <div class=\"eba-calendar-prev\">\n            <span class=\"eba-calendar-yearPrev\"></span>\n            <span class=\"eba-calendar-monthPrev\"></span>\n          </div>\n          <div class=\"eba-calendar-next\">\n            <span class=\"eba-calendar-monthNext\"></span>\n            <span class=\"eba-calendar-yearNext\"></span>\n          </div>\n          <span class=\"eba-calendar-title\"></span>\n        </div>\n      </td>\n    </tr>\n    <!-- title -->\n    <tr data-inner-role=\"header\" class=\"eba-calendar-daysheader\"></tr>\n    <!-- weeks -->\n    <!-- footer -->\n    <tr data-inner-role=\"footer\">\n      <td colspan=\"10\">\n        <div class=\"eba-calendar-footer\">\n          <span data-inner-role=\"spinner\" style=\"display:none;\">\n            <!-- timespinner -->\n            <input />\n          </span>\n          <span data-inner-role=\"buttons\">\n            <!-- buttons -->\n            <input data-inner-role=\"today\" />\n            <span class=\"eba-calendar-footerSpace\"></span>\n            <input data-inner-role=\"apply\" />\n          </span>\n        </div>\n      </td>\n    </tr>\n    <!-- footer -->\n  </tbody>\n</table>\n<div>";

  webui.injectTmpl('MainView', '_rootTmpl', calMVRootTmpl);

  calMVHeaderTmpl = "<td class=\"eba-calendar-space\"></td>\n<% \n  for (var i = 0; i < text.length; i++) { \n%>\n<td><%=text[i]%></td>\n<% } %>\n<td class=\"eba-calendar-space\"></td>";

  webui.injectTmpl('MainView', '_headerTmpl', calMVHeaderTmpl);

  calMVWeekTmpl = "<% \n  var today = new Date;\n  for (var i = 0; i < weeks.length; i++) { \n    var week = weeks[i];\n%>\n\n<tr class=\"eba-calendar-days\">\n  <td class=\"eba-calendar-space\"></td>\n\n<% \n    for (var j = 0; j < week.length; j++) {\n\n      var day = week[j],\n          date = new Date( day[0],day[1],day[2] ),\n          dayInWeek = date.getDay(),\n          valueString = day[0] + \"-\" + (day[1] + 1) + \"-\" + day[2];\n\n      var selected = ( day[0] == value[0] ) && ( day[1] == value[1] ) && ( day[2] == value[2] );\n      var isToday = ( day[0] == today.getFullYear() ) && ( day[1] == today.getMonth() ) && ( day[2] == today.getDate() );\n      var isWeekend = dayInWeek == 0 || dayInWeek == 6;\n      var isOtherMonth = ( day[1] > month || day[1] < month );\n%>\n  \n  <td data-value=\"<%=valueString%>\" \n      class=\"eba-calendar-date <%= isOtherMonth ? 'eba-calendar-othermonth' : '' %> <%= isWeekend ? ' eba-calendar-weekend' : '' %> <%= isToday ? 'eba-calendar-today' : ''%> <%= selected ? 'eba-calendar-selected' : ''%>\"><%=day[2]%></td>\n\n<% } %>\n\n  <td class=\"eba-calendar-space\"></td>\n</tr>\n\n<% } %>";

  webui.injectTmpl('MainView', '_weekTmpl', calMVWeekTmpl);

  calMTVRootTmpl = "<div data-role=\"monthview\" style=\"display:none;\" data-options=\"{ visible : false }\">\n  <div class=\"eba-calendar-menu-months\">\n  </div>\n\n  <div class=\"eba-calendar-menu-years\">\n  </div>\n\n  <div class=\"eba-calendar-footer\">\n    <span class=\"eba-calendar-okButton\">确定</span>\n    <span class=\"eba-calendar-footerSpace\"></span>\n    <span class=\"eba-calendar-cancelButton\">取消</span>\n  </div>\n  <div style=\"clear:both;\"></div>\n</div>";

  webui.injectTmpl('MonthView', '_rootTmpl', calMTVRootTmpl);

  calMTVMonthsTmpl = "<% for (var i = 0; i < months.length; i++) {%>\n\n   <a data-value=\"<%= i %>\" class=\"eba-calendar-menu-month <%=( currentMonth == i ) ? 'eba-calendar-menu-selected' : '' %>\"><%= months[i] %></a>\n\n<%} %>\n<div style=\"clear:both;\"></div>";

  webui.injectTmpl('MonthView', '_monthsTmpl', calMTVMonthsTmpl);

  calMTVYearsTmpl = "<% for (i = 0,max = years.length - 1; i <= max; i++) {%>\n   <a data-value=\"<%=years[i]%>\" class=\"eba-calendar-menu-year <%=( value[0] == years[i] ) ? 'eba-calendar-menu-selected' : '' %>\"><%= years[i] %></a>\n<%} %>\n<div class=\"eba-calendar-menu-prevYear\" data-value=\"<%=years[0] - 10%>\"></div>\n<div class=\"eba-calendar-menu-nextYear\" data-value=\"<%=years[max] + 1%>\"></div>\n<div style=\"clear:both;\"></div>";

  webui.injectTmpl('MonthView', '_yearsTmpl', calMTVYearsTmpl);

  calRootTmpl = "<div data-role=\"calendar\" data-ns=\"web.form\" class=\"eba-calendar\">\n  <input data-inner-role=\"mainview\" />\n  <input data-inner-role=\"monthview\" />\n</div>";

  webui.injectTmpl('Calendar', '_rootTmpl', calRootTmpl);

  fileUperTmpl = "<span data-role=\"fileuploader\" data-ns=\"web.form\" class=\"eba-buttonedit eba-htmlfile eba-fileupload\">\n\n  <span class=\"eba-buttonedit-border\">\n    <input type=\"text\" class=\"eba-buttonedit-input\" autocomplete=\"off\">\n    <label for=\"\" class=\"eba-placeholder-lable\"></label>\n    <span class=\"eba-buttonedit-buttons\">\n      <span class=\"eba-buttonedit-close\"></span>\n      <span class=\"eba-buttonedit-button\">浏览...</span>\n    </span>\n  </span>\n\n</span>";

  webui.injectTmpl('FileUploader', '_rootTmpl', fileUperTmpl);

  tabHeader = "<li class=\"eba-tab\">\n    <span class=\"eba-tab-icon\"></span>\n    <span class=\"eba-tab-text\"></span>\n</li>";

  webui.injectTmpl('Tab', '_headerTmpl', tabHeader);

  tabContent = "<li>\n    <iframe src=\"{0}\" scrolling=\"auto\" allowtransparency=\"yes\" frameborder=\"no\" style=\"width:100%;height:100%;\"></iframe>\n</li>";

  webui.injectTmpl('Tab', '_contentTmpl', tabContent);

  tabs = "<div data-role=\"tabs\" class=\"eba-tabs\">\n    <div class=\"eba-tabs-header\">\n        <div class=\"eba-tabs-header-content\"><ul></ul></div>\n    </div>\n</div>";

  webui.injectTmpl('Tabs', '_rootTmpl', tabs);

}).call(this);
