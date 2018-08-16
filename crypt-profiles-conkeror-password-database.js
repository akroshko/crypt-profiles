/// crypt-profiles-conkeror-password-database.js
//
// Copyright (C) 2016-2018, Andrew Kroshko, all rights reserved.
//
// Author: Andrew Kroshko
// Maintainer: Andrew Kroshko <akroshko.public+devel@gmail.com>
// Created: Mon Jun 20, 2016
// Version: 20180814
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

// TODO: not a great way to get hostname, but serves its purpose for now
define_variable("current_hostname","",
    "Holds the current hostname");
// TODO: want to do this without interactive.
interactive("myhost",
    "Set the current hostname.",
    function set_hostname () {
        // TODO: need to remember how this works
        //       definitely need better way for shell command output
        var thecmd = "hostname";
        var out = "";
        var result = yield shell_command(thecmd,
                                         $fds=[{output: async_binary_string_writer("")},
                                               {input:  async_binary_reader(function (s) out += s || "") }]);
        current_hostname=out.trim();
    });

var logindata;
// allow defining this elsewhere
if (logindata == undefined) {
    logindata = {};
}

logindata["twitter"] =       {"url":"https://twitter.com/login/",
                              "login-class":"js-username-field email-input js-initial-focus",
                              "password-class":"js-password-field",
                              "submit-narrow":".signin-wrapper",
                              "submit-element":"button",
                              "submit-type":"submit"};
logindata["facebook"] =      {"url":"https://www.facebook.com/login.php",
                              "login-id":"email",
                              "password-id":"pass",
                              "submit-id":"loginbutton"};
logindata["gmail"] =         {"url":"https://accounts.google.com/ServiceLogin?sacu=1&scc=1&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&service=mail&ltmpl=default",
                              "logout-url":"https://mail.google.com/mail/logout?hl=en"};
logindata["youtube"] =       {"url":"https://accounts.google.com/ServiceLogin?continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26next%3D%252Ffeed%252Fsubscriptions%26hl%3Den-GB%26feature%3Dredirect_login&service=youtube&sacu=1&passive=1209600&ignoreShadow=0&acui=0",
                              "logout-url":"https://www.youtube.com/logout"};
logindata["instagram"] =     {"url":"https://www.instagram.com/accounts/login/?force_classic_login",
                              "login-id":"id_username",
                              'password-id':"id_password",
                              'submit-element':'input',
                              'submit-type':'submit',
                              "logout-url":"https://instagram.com/accounts/logout"};
logindata["amazonca"] =      {"url":"https://www.amazon.ca/ap/signin?_encoding=UTF8&openid.assoc_handle=caflex&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.ca%2Fgp%2Fcss%2Fhomepage.html%2Fref%3Dnav_signin",
                              "login-id":"ap_email",
                              "password-id":"ap_password"};
logindata["amazoncom"] =     {"url":"https://www.amazon.com/ap/signin?_encoding=UTF8&openid.assoc_handle=usflex&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Fgp%2Fyourstore%2Fhome%3Fie%3DUTF8%26action%3Dsign-out%26path%3D%252Fgp%252Fyourstore%252Fhome%26ref_%3Dnav_youraccount_signout%26signIn%3D1%26useRedirectOnSuccess%3D1",
                              "login-id":"ap_email",
                              "password-id":"ap_password"};
logindata["usask"] =         {"url":"https://pawscas.usask.ca/cas-web/login?service=https%3A%2F%2Fpaws5.usask.ca%2Fc%2Fportal%2Flogin",
                              "login-id":"username",
                              "password-id":"password",
                              "submit-class":"btn btn-primary btn-block mbmd",
                              "logout-url":"https://pawscas.usask.ca/cas-web/logout"};
logindata["tdcanadatrust"] = {"url":"https://easyweb.td.com/waw/idp/login.htm",
                              "login-id":"username100",
                              "password-id":"password",
                              "submit-element":"button",
                              "submit-type":"submit"};
logindata["vimeo"] =         {"url":"https://vimeo.com/log_in",
                              "login-id":"signup_email",
                              "password-id":"login_password",
                              "submit-element":"input",
                              "submit-value":"Log in with email"};
logindata["pcmastercard"] =  {"url":"https://online.pcmastercard.ca/PCB_Consumer/Login.do?LAN=EN",
                              "login-id":"username",
                              "password-id":"password",
                              "submit-element":"input",
                              "submit-value":"Sign On"};
// TODO: needs a special function
logindata["mec"] =           {"url":"https://www.mec.ca/Membership/login.jsp",
                              "login-id":"j_username",
                              "password-id":"j_password",
                              "submit-class":"btn btn-primary btn-block js-btn-modal-sign-in js-form-submit"};
logindata["telusmobility"] = {"url":"https://telusidentity.telus.com/as/authorization.oauth2?client_id=uni_portal&response_type=code&scope=priceplaninfo+securitymgmt+usagedetails+profilemanagement+invoiceinfo+usagemanagement+accountactivity+subscriberinfo+paymentmanagement+paymentprocessing+accountinfo+devicemanagement+serviceeligibility+loyaltyandrewards+recommendationmanagement+profileinfohighdetail+usagepreferencemanagement+usagemeter+usagenotificationacceptancehistory+usageblockmanagement+tvrequisition+tvsusbscriptioninfo+internetservicemanagement+customerinfo&redirect_uri=https%3A%2F%2Fwww.telus.com%2Fmy-account%2Foauth_callback",
                              "login-id":"idtoken1",
                              "password-id":"idtoken2",
                              "submit-narrow":"form#login",
                              "submit-element":"button",
                              "submit-type":"submit"};
logindata["flickr"] =        {"url":"https://login.yahoo.com/config/login?.src=flickrsignin"};
logindata["github"] =        {"url":"https://github.com/login",
                              "login-id":"login_field",
                              "password-id":"password",
                              "submit-element":"input",
                              "submit-type":"submit",
                              // TODO: will need additional click
                              "logout-url":"https://github.com/logout"};
logindata["newegg"] =        {"url":"https://secure.newegg.ca/NewMyAccount/AccountLogin.aspx",
                              "login-id":"UserName",
                              "password-id":"UserPwd",
                              "submit-id":"submitLogin"};
logindata["abebooks"] =      {"url":"https://www.abebooks.com/servlet/SignOnPL?msg=You+are+not+authorized+to+view+this+page.++Either+you+have+not+signed+on+or+you+are+trying+to+access+a+page+that+requires+a+higher+level+of+authority.&cm_sp=TopNav-_-Home-_-MMM&goto=MembersMainMenu%3F",
                              "login-id":"email",
                              "password-id":"password",
                              "submit-id":"signon-button"};
// TODO: here
logindata["memoryexpress"] = {"url":"https://www.memoryexpress.com/User/Login.aspx"};
logindata["clubtread"] =     {"url":"http://forums.clubtread.com/register.php",
                              "login-id":"navbar_username",
                              "password-id":"navbar_password",
                              "submit-class":"button"};
logindata["strava"] =        {"url":"https://www.strava.com/login",
                              "login-id":"email",
                              "password-id":"password",
                              "submit-id":"login-button"};
logindata["buyapi"] =        {"url":"https://www.buyapi.ca/my-account/",
                              "login-id":"username",
                              "password-id":"password",
                              "submit-class":"woocommerce-Button button"};
// TODO: nonfunctional
logindata["digikey"] =       {"url":"https://www.digikey.ca/MyDigiKey/Login"};
logindata["ebay"]    =       {"url":"https://signin.ebay.ca/ws/eBayISAPI.dll?SignIn&ru=http%3A%2F%2Fwww.ebay.ca%2F",
                              "login-id":"userid",
                              "password-id":"pass",
                              "submit-id":"sgnBt"};
logindata["twitch"]  =       {"url":"https://www.twitch.tv/login"};
logindata["discord"]    =    {"url":"https://discordapp.com/login",
                              "login-element":"input",
                              "login-type":"email",
                              "password-element":"input",
                              "password-type":"password",
                              "submit-element":"button",
                              "submit-type":"submit"};
logindata["deviantart"] =    {"url":"https://www.deviantart.com/users/login",
                              "login-id":"login_username",
                              "password-id":"login_password",
                              "submit-class":"smbutton smbutton-size-default smbutton-shadow smbutton-blue"}
// TODO: need to hit key in field for this one too
logindata["linkedin"] =    {"url":"https://ca.linkedin.com/",
                            "login-id":"login-email",
                            "password-id":"login-password"
                            // ,
                            // "submit-class":"login-submit"
                           }
logindata["pixiv"] =    {"url":"https://accounts.pixiv.net/login?lang=en&source=pc&view_type=page"}
// TODO: might be an issue
logindata["soundcloud"] =    {"url":"https://soundcloud.com/signin"};
logindata["noip"] =          {"url":"https://www.noip.com/login",
                              "login-element":"input",
                              "login-type":"text",
                              "password-element":"input",
                              "password-type":"password",
                              "submit-element":"button",
                              "submit-type":"submit"};

initialstate=0

define_key(content_buffer_normal_keymap, "s-p",
    "get-current-password-login");
define_key(content_buffer_normal_keymap, "C-u s-p",
    "current-signout");
define_key(content_buffer_normal_keymap, "M-s-p",
    "get-current-password-login-alternate");
define_key(content_buffer_normal_keymap, "M-s-P",
    "get-current-password-login-tertiary");
// TODO: add $repeat = "insert-current-password"
// TODO: decide which one to do
define_key(content_buffer_normal_keymap, "C-s-p",
    "insert-current-password");
define_key(content_buffer_normal_keymap, "s-P",
           "insert-current-password");
// TODO: just need to update password thing now, and do search function :)
interactive("get-current-password-login","Get the login for the primary acount for particular sites.",
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
        browser_object_follow(I.buffer,OPEN_CURRENT_BUFFER,logindata[theloginname]["url"]);
        I.window.minibuffer.message(theloginname);
        initialstate = 0;
    });

interactive("get-current-password-login-alternate","Get the login for the secondary account for particular sites.",
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
        browser_object_follow(I.buffer,OPEN_CURRENT_BUFFER,logindata[theloginname]["url"]);
        I.window.minibuffer.message(theloginname);
        initialstate = 0;
    });

interactive("get-current-password-login-tertiary","Get the login for the tertiary acount for particular sites.",
    function (I) {
        unfocus(I.window, I.buffer);
        // TODO: get the password here
        var base64_currenturl=btoa(unescape(I.buffer.display_uri_string));
        var cmd_str="launch-emacsclient noframe --eval \'(crypt-profiles-get-matching-password \"" + base64_currenturl + "\" 3)\'";
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
        browser_object_follow(I.buffer,OPEN_CURRENT_BUFFER,logindata[theloginname]["url"]);
        I.window.minibuffer.message(theloginname);
        initialstate = 0;
    });

function type_manually(I,thestring) {
    for (thec in thestring) {
        send_key_as_event(I.window,
                          I.buffer.focused_element,
                          thestring[thec]);
        // I was getting many queries about being a real person at one point,
        // so add a bit of randomness to keystroke entry
        sleep(20.0 + Math.random()*30.0);
    }
}

interactive("insert-current-password","Get the current password and login for particular sites.",
    function (I) {
        unfocus(I.window, I.buffer);
        if ( theloginname == "gmail" || theloginname == "youtube" ) {
            var n1 = I.buffer.document.getElementById("Email");
            if ( n1 == null || n1.readOnly == true ) {
                var n2 = I.buffer.document.getElementById("Passwd");
                browser_element_focus(I.buffer, n2);
                type_manually(I,theloginpassword);
                sleep(100.0);
                var theform = I.buffer.document.getElementsByClassName("rc-button rc-button-submit");
                theform[0].click();
            } else {
                browser_element_focus(I.buffer, n1);
                type_manually(I,theloginuser);
                sleep(100.0);
                var theform = I.buffer.document.getElementsByClassName("rc-button rc-button-submit");
                theform[0].click();
            }
        } else if ( theloginname == "flickr" ) {
            // TODO: have to fix this
            var n1 = I.buffer.document.getElementById("login-username");
            if ( n1 == null || initialstate == 1 ) {
                var n2 = I.buffer.document.getElementById("login-passwd");
                browser_element_focus(I.buffer, n2);
                type_manually(I,theloginpassword);
                sleep(100.0);
                var theform = I.buffer.document.getElementById("login-signin");
                theform.click();
            } else {
                browser_element_focus(I.buffer, n1);
                type_manually(I,theloginuser);
                sleep(100.0);
                initialstate = 1;
                var theform = I.buffer.document.getElementById("login-signin");
                theform.click();
            }
        } else if ( theloginname == "twitch" ) {
            // TODO: will have to use state
            var n1 = I.buffer.document.getElementById("username");
            browser_element_focus(I.buffer, n1);
            type_manually(I,theloginuser);
            sleep(100.0);
            var n2_wrapper = I.buffer.document.getElementById("password");
            var n2 = n2_wrapper.getElementsByClassName("text");
            browser_element_focus(I.buffer, n2[0]);
            type_manually(I,theloginpassword);
            sleep(100.0);
            var thebutton = I.buffer.document.getElementsByClassName("primary button js-login-button");
            thebutton[0].click();
        } else if ( theloginname == "amazonca" || theloginname == "amazoncom" ) {
            var n1 = I.buffer.document.getElementById("ap_email");
            if ( n1 == null || initialstate == 1 ) {
                var n2 = I.buffer.document.getElementById("ap_password");
                browser_element_focus(I.buffer, n2);
                type_manually(I,theloginpassword);
                sleep(100.0);
                var theform = I.buffer.document.getElementsByClassName("a-button-input")[0];
                theform.click();
            } else {
                browser_element_focus(I.buffer, n1);
                type_manually(I,theloginuser);
                sleep(100.0);
                initialstate = 1;
                var theform = I.buffer.document.getElementsByClassName("a-button-input")[0];
                theform.click();
            }
        } else if ( theloginname == "pixiv" ) {
            // TODO: will have to use state
            var nall = I.buffer.document.getElementsByClassName("input-field");
            var n1 = nall[0];
            var n1_inner = n1.getElementsByTagName("input")[0];
            browser_element_focus(I.buffer, n1_inner);
            n1_inner.value = theloginuser;
            // type_manually(I,theloginuser);
            sleep(100.0);
            var n2 = nall[1];
            var n2_inner = n2.getElementsByTagName("input")[0];
            browser_element_focus(I.buffer, n2_inner);
            n2_inner.value = theloginpassword;
            // type_manually(I,theloginpassword);
            sleep(100.0);
            var thebutton = I.buffer.document.getElementsByClassName("signup-form__submit");
            thebutton[0].click();
        } else if ( theloginname == "digikey" ) {
            // https://www.w3schools.com/jsref/prop_frame_contentdocument.asp
            // TODO: make more universal for dealing with logins with frames
            var outer_frame = I.buffer.document.getElementById("frmLogin");
            var outer_or = (outer_frame.contentWindow || outer_frame.contentDocument);
            var outer = outer_or.document;
            var n1 = outer.getElementById("username");
            browser_element_focus(I.buffer, n1);
            type_manually(I,theloginuser);
            sleep(100.0);
            var n2 = outer.getElementById("password");
            browser_element_focus(I.buffer, n2);
            type_manually(I,theloginpassword);
            sleep(100.0);
            var thebutton = outer.getElementById("btnPostLogin");
            thebutton.click();
        } else if ( theloginname == "soundcloud" ) {
            I.window.minibuffer.message("soundcloud not supported");
        } else {
            // XXXX: some websites do not like the .value attribute being set directly
            //       hence the wierd copy/pasting
            var login_document=I.buffer.document;
            if ( "login-id" in logindata[theloginname] ) {
                var n1 = login_document.getElementById(logindata[theloginname]["login-id"]);
                browser_element_focus(I.buffer, n1);
                sleep(100.0);
                type_manually(I,theloginuser);
                sleep(100.0);
            } else if ( "login-class" in logindata[theloginname] ) {
                var n1 = login_document.getElementsByClassName(logindata[theloginname]["login-class"])[0];
                browser_element_focus(I.buffer, n1);
                type_manually(I,theloginuser);
                sleep(100.0);
            } else if ( "login-element" in logindata[theloginname] && "login-type" in logindata[theloginname] ) {
                var theelements = login_document.querySelectorAll(logindata[theloginname]["login-element"]);
                for (e in theelements) {
                    if (theelements[e].type == logindata[theloginname]['login-type']) {
                        var n1 = theelements[e];
                        break;
                    }
                }
                browser_element_focus(I.buffer, n1);
                sleep(100.0);
                type_manually(I,theloginuser);
                sleep(100.0);
            } else if ( "login-element" in logindata[theloginname] && "login-name" in logindata[theloginname] ) {
                var theelements = login_document.querySelectorAll(logindata[theloginname]["login-element"]);
                for (e in theelements) {
                    if (theelements[e].name == logindata[theloginname]['login-name']) {
                        var n1 = theelements[e];
                        break;
                    }
                }
                browser_element_focus(I.buffer, n1);
                sleep(100.0);
                type_manually(I,theloginuser);
                sleep(100.0);
            }
            ////////////////////////////////////////////////////////////////////////////////
            if ( "password-id" in logindata[theloginname] ) {
                var n2 = login_document.getElementById(logindata[theloginname]["password-id"]);
                browser_element_focus(I.buffer, n2);
                sleep(100.0);
                type_manually(I,theloginpassword);
                sleep(100.0);
            } else if ( "password-class" in logindata[theloginname] ) {
                var n2 = login_document.getElementsByClassName(logindata[theloginname]["password-class"])[0];
                browser_element_focus(I.buffer, n2);
                type_manually(I,theloginpassword);
                sleep(100.0);
            } else if ( "password-element" in logindata[theloginname] && "password-type" in logindata[theloginname] ) {
                var theelements = login_document.querySelectorAll(logindata[theloginname]["password-element"]);
                for (e in theelements) {
                    if (theelements[e].type == logindata[theloginname]['password-type']) {
                        var n1 = theelements[e];
                        break;
                    }
                }
                browser_element_focus(I.buffer, n1);
                sleep(100.0);
                type_manually(I,theloginpassword);
                sleep(100.0);
            } else if ( "password-element" in logindata[theloginname] && "password-name" in logindata[theloginname] ) {
                var theelements = login_document.querySelectorAll(logindata[theloginname]["password-element"]);
                for (e in theelements) {
                    if (theelements[e].name == logindata[theloginname]['password-name']) {
                        var n1 = theelements[e];
                        break;
                    }
                }
                browser_element_focus(I.buffer, n1);
                sleep(100.0);
                type_manually(I,theloginpassword);
                sleep(100.0);
            }
            ////////////////////////////////////////////////////////////////////////////////
            if ( "submit-id" in logindata[theloginname] ) {
                var thebutton = login_document.getElementById(logindata[theloginname]["submit-id"]);
                thebutton.click();
            } else if ( "submit-class" in logindata[theloginname] ) {
                var thebutton = login_document.getElementsByClassName(logindata[theloginname]["submit-class"])[0];
                thebutton.click();
            } else if ( "submit-element" in logindata[theloginname] && "submit-value" in logindata[theloginname] ) {
                var theelements = login_document.querySelectorAll(logindata[theloginname]["submit-element"]);
                // now find the value in the elements
                for (e in theelements) {
                    if (theelements[e].value == logindata[theloginname]['submit-value']) {
                        var thebutton = theelements[e];
                        break;
                    }
                }
                thebutton.click();
            } else if ( "submit-element" in logindata[theloginname] && "submit-type" in logindata[theloginname] ) {
                if ( "submit-narrow" in logindata[theloginname] ) {
                    var submit_document = login_document.querySelectorAll(logindata[theloginname]["submit-narrow"])[0];
                } else {
                    var submit_document=login_document;
                }
                var theelements = submit_document.querySelectorAll(logindata[theloginname]["submit-element"]);
                // now find the value in the elemens
                for (e in theelements) {
                    if (theelements[e].type == logindata[theloginname]['submit-type']) {
                        var thebutton = theelements[e];
                        break;
                    }
                }
                thebutton.click();
            }
        }
    });

interactive("current-signout","Sign out from current website..",
    function (I) {
        unfocus(I.window, I.buffer);
        // TODO: get the password here
        var base64_currenturl=btoa(unescape(I.buffer.display_uri_string));
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
        I.window.minibuffer.message(theloginname);
        theurl = I.buffer.display_uri_string;
        if ( 'logout-url' in logindata[theloginname]) {
            browser_object_follow(I.buffer,OPEN_CURRENT_BUFFER,logindata[theloginname]['logout-url']);
        } else if (theurl.match(/twitter.com/)) {
            // https://twitter.com/logout except it confirms and have to press button anyways
            var thebutton = I.buffer.document.getElementsByClassName("js-signout-button");
            thebutton[0].click();
        }
    });
