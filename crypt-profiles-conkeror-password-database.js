/// crypt-profiles-conkeror-password-database.js
//
// Copyright (C) 2016, Andrew Kroshko, all rights reserved.
//
// Author: Andrew Kroshko
// Maintainer: Andrew Kroshko <akroshko.public+devel@gmail.com>
// Created: Mon Jun 20, 2016
// Version: 20160620
// URL: https://github.com/akroshko/crypt-profiles
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License as
// published by the Free Software Foundation; either version 3, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; see the file COPYING.  If not, write to
// the Free Software Foundation, Inc., 51 Franklin Street, Fifth
// Floor, Boston, MA 02110-1301, USA.
//
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
//
// Commentary:
//
// crypt profiles password database
//
// Put into conkerorrc.js or the ~/.conkerorrc/ directory.  Use s-p to
// load the password go to the login page, then C-s-p to enter into
// approopriate forms.
//
// Assumes Emacs is configured to open or already have opened the
// appropriate secrets.org.gpg file used as the password database.
//
// New websites can be set up 95% of the time by looking at the source
// and getting the id for the <input /> element corresponding to
// password and username.
//
/// Code:

// TODO: One button push or at least autologin.

// TODO: Auto-logout to better handle secondary accounts.

// TODO: Many more websites.

// TODO: Simplify login links where possible.

// TODO: Better format for logindata database.

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

logindata = {};
logindata["twitter"] =       ["https://twitter.com/login/"];
logindata["facebook"] =      ["https://www.facebook.com/login.php",
                              "email",
                              "pass"];
logindata["gmail"] =         ["https://accounts.google.com/ServiceLogin?continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&ltmpl=default&service=mail&sacu=1&scc=1&passive=1209600&ignoreShadow=0&acui=0"];
logindata["youtube"] =       ["https://accounts.google.com/ServiceLogin?continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26next%3D%252Ffeed%252Fsubscriptions%26hl%3Den-GB%26feature%3Dredirect_login&service=youtube&sacu=1&passive=1209600&ignoreShadow=0&acui=0"];
logindata["instagram"] =     ["https://www.instagram.com/accounts/login/?force_classic_login",
                              "id_username",
                              "id_password"];
logindata["amazonca"] =      ["https://www.amazon.ca/ap/signin?_encoding=UTF8&openid.assoc_handle=caflex&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.ca%2Fgp%2Fcss%2Fhomepage.html%2Fref%3Dnav_signin",
                              "ap_email",
                              "ap_password"];
logindata["amazoncom"] =     ["https://www.amazon.com/ap/signin?_encoding=UTF8&openid.assoc_handle=usflex&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Fgp%2Fyourstore%2Fhome%3Fie%3DUTF8%26action%3Dsign-out%26path%3D%252Fgp%252Fyourstore%252Fhome%26ref_%3Dnav_youraccount_signout%26signIn%3D1%26useRedirectOnSuccess%3D1",
                              "ap_email",
                              "ap_password"];
logindata["usask"] =         ["https://pawscas.usask.ca/cas-web/login?service=https%3A%2F%2Fpaws5.usask.ca%2Fc%2Fportal%2Flogin",
                              "username",
                              "password"];
logindata["tdcanadatrust"] = ["https://easyweb.td.com/waw/idp/login.htm",
                              "login:AccessCard",
                              "login:Webpassword"];
logindata["vimeo"] =         ["https://vimeo.com/log_in"];
logindata["pcmastercard"] =  ["https://online.pcmastercard.ca/PCB_Consumer/Login.do?LAN=EN",
                              "username",
                              "password"];
// TODO: needs a special function
logindata["mec"] =           ["https://www.mec.ca/Membership/login.jsp"];
logindata["telusmobility"] = ["https://telusidentity.telus.com/as/authorization.oauth2?client_id=uni_portal&response_type=code&scope=priceplaninfo+securitymgmt+usagedetails+profilemanagement+invoiceinfo+usagemanagement+accountactivity+subscriberinfo+paymentmanagement+paymentprocessing+accountinfo+devicemanagement+serviceeligibility+loyaltyandrewards+recommendationmanagement+profileinfohighdetail+usagepreferencemanagement+usagemeter+usagenotificationacceptancehistory+usageblockmanagement+tvrequisition+tvsusbscriptioninfo+internetservicemanagement+customerinfo&redirect_uri=https%3A%2F%2Fwww.telus.com%2Fmy-account%2Foauth_callback",
                              "IDToken1",
                              "IDToken2"];
logindata["flickr"] =        ["https://login.yahoo.com/config/login?.src=flickrsignin"];
logindata["github"] =        ["https://github.com/login",
                              "login_field",
                              "password"];
logindata["newegg"] =        ["https://secure.newegg.ca/NewMyAccount/AccountLogin.aspx",
                              "UserName",
                              "UserPwd"];
logindata["abebooks"] =      ["https://www.abebooks.com/servlet/SignOnPL?msg=You+are+not+authorized+to+view+this+page.++Either+you+have+not+signed+on+or+you+are+trying+to+access+a+page+that+requires+a+higher+level+of+authority.&cm_sp=TopNav-_-Home-_-MMM&goto=MembersMainMenu%3F",
                              "email",
                              "password"];
logindata["memoryexpress"] = ["https://www.memoryexpress.com/User/Login.aspx"];
logindata["clubtread"] =     ["http://forums.clubtread.com/register.php",
                              "navbar_username",
                              "navbar_password"];
logindata["strava"] =        ["https://www.strava.com/login",
                              "email",
                              "password"];
logindata["buyapi"] =        ["https://www.buyapi.ca/my-account/",
                              "username",
                              "password"];
// TODO: nonfunctional
logindata["digikey"] =       ["https://www.digikey.ca/MyDigiKey/Login",
                              "username",
                              "password"];
// TODO: nonfunctional
logindata["ebay"]    =       ["https://signin.ebay.ca/ws/eBayISAPI.dll?SignIn&ru=http%3A%2F%2Fwww.ebay.ca%2F",
                              "userid",
                              "pass"]

// TODO: might be an issue
logindata["soundcloud"] =    ["https://soundcloud.com/signin"];

initialstate=0

define_key(content_buffer_normal_keymap, "s-p",
    "get-current-password-login");
define_key(content_buffer_normal_keymap, "M-s-p",
    "get-current-password-login-alternate");
// TODO: add $repeat = "insert-current-password"
// TODO: decide which one to do
define_key(content_buffer_normal_keymap, "C-s-p",
    "insert-current-password");
define_key(content_buffer_normal_keymap, "s-P",
           "insert-current-password");
// TODO: just need to update password thing now, and do search function :)
interactive("get-current-password-login","Get the current password and login for particular sites.",
    function (I) {
        unfocus(I.window, I.buffer);
        // TODO: get the password here
        var base64_currenturl=btoa(unescape(I.buffer.display_uri_string));
        /// TODO: environment variable problem with conkeror
        var cmd_str="launch-emacsclient noframe --eval \'(crypt-profiles-get-matching-password \"" + base64_currenturl + "\")\'";
        // credit where credit is due
        // http://conkeror.org/Tips#Using_an_external_password_manager
        var out = "";
        var result = yield shell_command(cmd_str,
                                         $fds=[{output: async_binary_string_writer("")},
                                               {input: async_binary_reader(function (s) out += s || "") }]);
        // TODO: not sure why slice is needed, there seems to be a spurious t coming out of emacs
        var thejson = eval(JSON.parse(out.slice(1)));
        // globals
        theloginname = thejson[0];
        theloginuser = thejson[1];
        theloginpassword = thejson[2];
        I.window.minibuffer.message("");
        browser_object_follow(I.buffer,OPEN_CURRENT_BUFFER,logindata[theloginname][0]);
        I.window.minibuffer.message(theloginname);
        initialstate = 0;
    });

interactive("get-current-password-login-alternate","Get the current password and login for particular sites but alternate ones.",
    function (I) {
        unfocus(I.window, I.buffer);
        // TODO: get the password here
        var base64_currenturl=btoa(unescape(I.buffer.display_uri_string));
        var cmd_str="launch-emacsclient noframe --eval \'(crypt-profiles-get-matching-password \"" + base64_currenturl + "\" t)\'";
        // credit where credit is due
        // http://conkeror.org/Tips#Using_an_external_password_manager
        var out = "";
        var result = yield shell_command(cmd_str,
                                         $fds=[{output: async_binary_string_writer("")},
                                               {input: async_binary_reader(function (s) out += s || "") }]);
        // TODO: not sure why slice is needed, there seems to be a spurious t coming out of emacs
        var thejson = eval(JSON.parse(out.slice(1)));
        // globals
        theloginname = thejson[0];
        theloginuser = thejson[1];
        theloginpassword = thejson[2];
        I.window.minibuffer.message("");
        browser_object_follow(I.buffer,OPEN_CURRENT_BUFFER,logindata[theloginname][0]);
        I.window.minibuffer.message(theloginname);
        initialstate = 0;
    });

interactive("insert-current-password","Get the current password and login for particular sites.",
    function (I) {
        // unfocus(I.window, I.buffer);
        if ( theloginname == "twitter" ) {
            var n1 = I.buffer.document.getElementsByClassName("js-username-field email-input js-initial-focus");
            browser_element_focus(I.buffer, n1[0]);
            n1[0].value = theloginuser;
            var n2 = I.buffer.document.getElementsByClassName("js-password-field");
            browser_element_focus(I.buffer, n2[0]);
            n2[0].value = theloginpassword;
        } else if ( theloginname == "gmail" || theloginname == "youtube" ) {
            var n1 = I.buffer.document.getElementById("Email");
            if ( n1 == null || n1.readOnly == true ) {
                var n2 = I.buffer.document.getElementById("Passwd");
                browser_element_focus(I.buffer, n2);
                n2.value = theloginpassword;
            } else {
                browser_element_focus(I.buffer, n1);
                n1.value = theloginuser;
            }
        } else if ( theloginname == "flickr" ) {
            // TODO: will have to use state
            var n1 = I.buffer.document.getElementById("login-username");
            if ( n1 == null || initialstate == 1 ) {
                var n2 = I.buffer.document.getElementById("login-passwd");
                browser_element_focus(I.buffer, n2);
                n2.value = theloginpassword;
            } else {
                browser_element_focus(I.buffer, n1);
                n1.value = theloginuser;
                initialstate = 1;
            }
        } else if ( theloginname == "vimeo" ) {
            I.window.minibuffer.message("vimeo");
        } else if ( theloginname == "mec" ) {
            I.window.minibuffer.message("mec");
        } else if ( theloginname == "soundcloud" ) {
            I.window.minibuffer.message("soundcloud");
        } else {
            var n1 = I.buffer.document.getElementById(logindata[theloginname][1]);
            browser_element_focus(I.buffer, n1);
            n1.value = theloginuser;
            var n2 = I.buffer.document.getElementById(logindata[theloginname][2]);
            browser_element_focus(I.buffer, n2);
            n2.value = theloginpassword;
        }
    });
