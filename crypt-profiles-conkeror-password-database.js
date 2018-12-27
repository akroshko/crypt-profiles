/// crypt-profiles-conkeror-password-database.js
//
// Copyright (C) 2016-2018, Andrew Kroshko, all rights reserved.
//
// Author: Andrew Kroshko
// Maintainer: Andrew Kroshko <akroshko.public+devel@gmail.com>
// Created: Mon Jun 20, 2016
// Version: 20181216
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

// TODO: Many more websites.

// TODO: Simplify login links where possible.

// TODO: Better format for logindata database.

// global variables
var g_pass_database_successful=false;
var g_selection=null;
var g_theloginkey=null;
var g_theloginuser=null;
var g_theloginpassword=null;
var g_theloginuri=null;
var g_thelogoutkey=null;
var g_thelogoutuser=null;
var g_thelogoutpassword=null;
var g_thelogouturi=null;
var g_initialstate=0;
// promises and hooks
var g_thedeferred_logout=null;
var g_thedeferred_final=null;
var g_thedeferred_final2=null;
var g_thedeferred_timeout=null;
// TODO: may not want these anymore

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

// // https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
// using sleep(<<delay>>).then()
function sleep_async (time) {
    // TODO: why does setTimeout I see on the web not work
    return new Promise((resolve) => call_after_timeout(resolve, time));
}

// TODO: not a great way to get hostname, but serves its purpose for now
define_variable("current_hostname","",
    "Holds the current hostname");
// TODO: want to do this without interactive.
interactive("myhost",
    "Set the current hostname",
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
if (typeof logindata == "undefined") {
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
logindata["youtube"] =       {"url":"https://accounts.google.com/ServiceLogin?service=youtube&sacu=1&continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26next%3D%252Ffeed%252Fsubscriptions%26hl%3Den-GB%26feature%3Dredirect_login",
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
                              "login-id":"md-input-0",
                              "password-id":"md-input-1",
                              "submit-narrow":"form[name=login_form]",
                              "submit-element":"button"};
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
logindata["findmespot"] =    {"url":"https://login.findmespot.com/spot-main-web/auth/login.html",
                              "login-id":"j_username",
                              "password-id":"j_password",
                              "submit-id":"login"};
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
// TODO: submit can only be identified by inner html
logindata["twitch"]  =       {"url":"https://www.twitch.tv/login"// ,
                              // "login-element":"input",
                              // "login-type":"text",
                              // "password-element":"input",
                              // "password-type":"password",
                              // "submit-element":"button"
                             };
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
// TODO: nice
logindata["quora"] =    {"url":""};

define_key(content_buffer_normal_keymap, "s-!", "get-current-password-login");
define_key(content_buffer_normal_keymap, "s-`", "current-signout");
define_key(content_buffer_normal_keymap, "s-@", "get-current-password-login-alternate");
define_key(content_buffer_normal_keymap, "s-#", "get-current-password-login-tertiary");
define_key(content_buffer_normal_keymap, "s-p", "insert-current-password");
function get_current_password_login(I, logintype, open_new_buffer=false) {
    unfocus(I.window, I.window.buffers.current);
    I.window.minibuffer.message("Finding current login and password");
    g_theloginkey = null;
    g_theloginuser = null;
    g_theloginpassword = null;
    g_theloginuri = null;
    g_initialstate = null;
    var base64_currenturl=btoa(unescape(I.window.buffers.current.display_uri_string));
    if (logintype >= 3) {
        var cmd_str="emacs -q --batch --eval '(progn (load \"~/.crypt-profiles-password-database.el\") (prin1 (crypt-profiles-get-matching-password \"" + base64_currenturl + "\" " + String(logintype) + ")))'"
    } else if (logintype == 2) {
        var cmd_str="emacs -q --batch --eval '(progn (load \"~/.crypt-profiles-password-database.el\") (prin1 (crypt-profiles-get-matching-password \"" + base64_currenturl + "\" t)))'"
    } else if (logintype == 1) {
        var cmd_str="emacs -q --batch --eval '(progn (load \"~/.crypt-profiles-password-database.el\") (prin1 (crypt-profiles-get-matching-password \"" + base64_currenturl + "\")))'"
    } else {
        I.window.alert("Invalid logintype!");
    }
    // credit where credit is due
    // http://conkeror.org/Tips#Using_an_external_password_manager
    var out = "";
    var thepromise = spawn_process("/bin/bash",
                                   [null, "-c", cmd_str],
                                   null,
                                   [{output: async_binary_string_writer("")},
                                    {input:  async_binary_reader(function (s) out += s || "") }]);
    var theuri="";
    thepromise.then(function(returncode) {
        var thejson = eval(JSON.parse(out));
        // globals
        g_theloginkey = thejson[0];
        I.window.minibuffer.message("Found login for: " + g_theloginkey);
        g_theloginuser = thejson[1];
        g_theloginpassword = thejson[2];
        g_theloginuri=logindata[g_theloginkey]["url"];
        g_initialstate = 0;
        I.window.minibuffer.message("");
        var spec = load_spec(g_theloginuri);
        if (open_new_buffer == true) {
            browser_object_follow(I.buffer, OPEN_NEW_BUFFER, spec);
        } else {
            I.buffer.load(spec);
        }
        I.window.minibuffer.message("Going to login for: " + g_theloginkey);
    });
    return thepromise;
}

function logout_resolve_hook_function () {
    // TODO check if buffer is loading and correct one
    g_thedeferred_logout.resolve();
}

function login_resolve_hook_function () {
    // TODO check if buffer is loading and correct one
    // TODO: would love to add some delays in, but not yet
    // sleep_async(1000).then(() => {
    //     g_thedeferred_final.resolve();
    // });
    g_thedeferred_final.resolve();
}

function login_resolve_hook_function2 () {
    // TODO check if buffer is loading and correct one
    g_thedeferred_final2.resolve();
}

function timeout_resolve_callback () {
    g_thedeferred_timeout.resolve();
}

function auto_login (I, open_new_buffer=false) {
    if (open_new_buffer==true) {
        var thepromise_signout = new Promise(function(resolve, reject) {
            resolve();
        });
        var original_buffer=I.buffer;
    } else {
        var thepromise_signout=current_signout(I);
    }
    thepromise_signout.then(function(result) {
        g_thedeferred_logout=Promise.defer();
        add_hook.call(I.window.buffers.current, "content_buffer_finished_loading_hook", logout_resolve_hook_function);
        return g_thedeferred_logout;
    }).then(function (result) {
        var thepromise=get_current_password_login(I,g_selection,open_new_buffer);
        return thepromise;
    }).then(function(result) {
        g_thedeferred_final=Promise.defer();
        add_hook.call(I.window.buffers.current, "content_buffer_finished_loading_hook", login_resolve_hook_function);
        return g_thedeferred_final.promise;
    // XXXX: still non-functional, need to find way to do this, probably a callback that lets command return
    // }).then(function (result) {
    //     var g_thedeferred_timeout=Promise.defer();
    //     call_after_timeout(timeout_resolve_callback,10000);
    //     return g_thedeferred_timeout;
    }).then(function(result) {
        remove_hook.call(I.window.buffers.current, "content_buffer_finished_loading_hook", login_resolve_hook_function);
        insert_current_password(I);
        g_thedeferred_final2=Promise.defer();
        if ( g_theloginkey == "gmail" || g_theloginkey == "youtube" ) {
            add_hook.call(I.window.buffers.current, "content_buffer_finished_loading_hook", login_resolve_hook_function2);
        } else {
            g_thedeferred_final2.resolve();
        }
        return g_thedeferred_final2.promise;
        // if (open_new_buffer==true) {
        //     // TODO: non-functional
        //     reload(I.window.buffers.current,true,null,null);
        // }
    }).then(function(result) {
        remove_hook.call(I.window.buffers.current, "content_buffer_finished_loading_hook", login_resolve_hook_function2);
        insert_current_password(I);
    });
    yield co_return(thepromise_signout);
}

// TODO: I am still learning how to write async javascript
interactive("get-current-password-login","Get the login for the primary acount for particular sites.",
    function (I) {
        var thepromise=get_current_password_login(I,1);
    });

interactive("auto-login-primary","Login to primary fully automatically.",
    function (I) {
        remove_old_hooks(I);
        g_selection=1;
        yield auto_login(I);
    });
define_key(content_buffer_normal_keymap, "s-1", "auto-login-primary");

// TODO: does not work yet, logout screws up things and hooks wrong buffer
interactive("auto-login-primary-new_buffer","Login to primary fully automatically, keep current buffer and login on new buffer.",
    function (I) {
        remove_old_hooks(I);
        g_selection=1;
        yield auto_login(I,true);
    });
define_key(content_buffer_normal_keymap, "C-u s-1", "auto-login-primary-new_buffer");

interactive("get-current-password-login-alternate","Get the login for the secondary account for particular sites.",
    function (I) {
        var thepromise=get_current_password_login(I,2);
    });

interactive("auto-login-2","Login to account profile 2 fully automatically.",
    function (I) {
        remove_old_hooks(I);
        g_selection=2;
        yield auto_login(I);
    });
define_key(content_buffer_normal_keymap, "s-2", "auto-login-2");

interactive("auto-login-2-new-buffer","Login to account profile 2 fully automatically.",
    function (I) {
        remove_old_hooks(I);
        g_selection=2;
        yield auto_login(I,true);
    });
define_key(content_buffer_normal_keymap, "C-u s-2", "auto-login-2-new-buffer");

interactive("get-current-password-login-tertiary","Get the login for the tertiary acount for particular sites.",
    function (I) {
        var thepromise=get_current_password_login(I,3);
    });

interactive("auto-login-3","Login to account profile 3 fully automatically.",
    function (I) {
        remove_old_hooks(I);
        g_selection=3;
        yield auto_login(I);
    });
define_key(content_buffer_normal_keymap, "s-3", "auto-login-3");

interactive("auto-login-3-new-buffer","Login to account profile 3 fully automatically.",
    function (I) {
        remove_old_hooks(I);
        g_selection=3;
        yield auto_login(I,true);
    });
define_key(content_buffer_normal_keymap, "C-u s-3", "auto-login-3-new-buffer");

interactive("auto-login-4","Login to account profile 4 fully automatically.",
    function (I) {
        remove_old_hooks(I);
        g_selection=4;
        yield auto_login(I);
    });
define_key(content_buffer_normal_keymap, "s-4", "auto-login-4");

interactive("auto-login-4-new-buffer","Login to account profile 4 fully automatically.",
    function (I) {
        remove_old_hooks(I);
        g_selection=4;
        yield auto_login(I,true);
    });
define_key(content_buffer_normal_keymap, "C-u s-4", "auto-login-4-new-buffer");

interactive("auto-login-5","Login to account profile 5 fully automatically.",
    function (I) {
        remove_old_hooks(I);
        g_selection=5;
        yield auto_login(I);
    });
define_key(content_buffer_normal_keymap, "s-5", "auto-login-5");

interactive("auto-login-5-new-buffer","Login to account profile 5 fully automatically.",
    function (I) {
        remove_old_hooks(I);
        g_selection=5;
        yield auto_login(I,true);
    });
define_key(content_buffer_normal_keymap, "C-u s-5", "auto-login-5-new-buffer");

interactive("auto-login-6","Login to account profile 6 fully automatically.",
    function (I) {
        remove_old_hooks(I);
        g_selection=6;
        yield auto_login(I);
    });
define_key(content_buffer_normal_keymap, "s-6", "auto-login-6");

interactive("auto-login-6-new-buffer","Login to account profile 6 fully automatically.",
    function (I) {
        remove_old_hooks(I);
        g_selection=6;
        yield auto_login(I,true);
    });
define_key(content_buffer_normal_keymap, "C-u s-6", "auto-login-6-new-buffer");

function remove_old_hooks(I) {
    remove_hook.call(I.window.buffers.current, "content_buffer_finished_loading_hook", logout_resolve_hook_function);
    remove_hook.call(I.window.buffers.current, "content_buffer_finished_loading_hook", login_resolve_hook_function);
    remove_hook.call(I.window.buffers.current, "content_buffer_finished_loading_hook", login_resolve_hook_function2);
}

function type_manually(I,thestring) {
    sleep(100.0);
    send_key_as_event(I.window,
                      I.window.buffers.current.focused_element,
                      'C-a');
    sleep(100.0+Math.random()*100.0);
    send_key_as_event(I.window,
                      I.window.buffers.current.focused_element,
                      'C-k');
    sleep(100.0+Math.random()*100.0);
    for (let thec in thestring) {
        send_key_as_event(I.window,
                          I.window.buffers.current.focused_element,
                          thestring[thec]);
        // TODO: use timeouts and async for this
        //       sleep locks up browser, so might be an issue with how this looks
        // I was getting many queries about being a real person at one point,
        // so add a bit of randomness to keystroke entry
        sleep(20.0 + Math.random()*30.0);
    }
    sleep(100.0);
}

function insert_current_password(I) {
    // TODO: these are like this because I was testing something
    unfocus(I.window, I.window.buffers.current);
    I.window.minibuffer.message("Entering login and password for: " + g_thelogoutkey);
    var login_document=I.window.buffers.current.document;
    if ( g_theloginkey == "gmail" || g_theloginkey == "youtube" ) {
        var n1 = login_document.getElementById("Email");
        if ( n1 == null || n1.readOnly == true ) {
            var n2 = login_document.getElementById("Passwd");
            browser_element_focus(I.window.buffers.current, n2);
            type_manually(I,g_theloginpassword);
            var theform = login_document.getElementsByClassName("rc-button rc-button-submit");
            theform[0].click();
        } else {
            browser_element_focus(I.window.buffers.current, n1);
            type_manually(I,g_theloginuser);
            var theform = login_document.getElementsByClassName("rc-button rc-button-submit");
            theform[0].click();
        }
    } else if ( g_theloginkey == "flickr" ) {
        // TODO: have to fix this
        var n1 = login_document.getElementById("login-username");
        if ( n1 == null || g_initialstate == 1 ) {
            var n2 = login_document.getElementById("login-passwd");
            browser_element_focus(I.window.buffers.current, n2);
            type_manually(I,g_theloginpassword);
            var theform = login_document.getElementById("login-signin");
            theform.click();
        } else {
            browser_element_focus(I.window.buffers.current, n1);
            type_manually(I,g_theloginuser);
            g_initialstate = 1;
            var theform = login_document.getElementById("login-signin");
            theform.click();
        }
    } else if ( g_theloginkey == "amazonca" || g_theloginkey == "amazoncom" ) {
        var n1 = login_document.getElementById("ap_email");
        if ( n1 == null || g_initialstate == 1 ) {
            var n2 = login_document.getElementById("ap_password");
            browser_element_focus(I.window.buffers.current, n2);
            type_manually(I,g_theloginpassword);
            var theform = login_document.getElementsByClassName("a-button-input")[0];
            theform.click();
        } else {
            browser_element_focus(I.window.buffers.current, n1);
            type_manually(I,g_theloginuser);
            g_initialstate = 1;
            var theform = login_document.getElementsByClassName("a-button-input")[0];
            theform.click();
        }
    } else if ( g_theloginkey == "pixiv" ) {
        // TODO: will have to use state
        var nall = login_document.getElementsByClassName("input-field");
        var n1 = nall[0];
        var n1_inner = n1.getElementsByTagName("input")[0];
        browser_element_focus(I.window.buffers.current, n1_inner);
        n1_inner.value = g_theloginuser;
        // type_manually(I,g_theloginuser);
        var n2 = nall[1];
        var n2_inner = n2.getElementsByTagName("input")[0];
        browser_element_focus(I.window.buffers.current, n2_inner);
        n2_inner.value = g_theloginpassword;
        // type_manually(I,g_theloginpassword);
        var thebutton = login_document.getElementsByClassName("signup-form__submit");
        thebutton[0].click();
    } else if ( g_theloginkey == "digikey" ) {
        // https://www.w3schools.com/jsref/prop_frame_contentdocument.asp
        // TODO: make more universal for dealing with logins with frames
        var outer_frame = login_document.getElementById("frmLogin");
        var outer_or = (outer_frame.contentWindow || outer_frame.contentDocument);
        var outer = outer_or.document;
        var n1 = outer.getElementById("username");
        browser_element_focus(I.window.buffers.current, n1);
        type_manually(I,g_theloginuser);
        var n2 = outer.getElementById("password");
        browser_element_focus(I.window.buffers.current, n2);
        type_manually(I,g_theloginpassword);
        var thebutton = outer.getElementById("btnPostLogin");
        thebutton.click();
    } else if ( g_theloginkey == "twitch" ) {
        var theinputs = login_document.querySelectorAll("form input");
        for (let e in theinputs) {
            if (theinputs[e].type == "text") {
                var n1 = theinputs[e];
                break;
            }
        }
        browser_element_focus(I.window.buffers.current, n1);
        type_manually(I,g_theloginuser);
        for (let e in theinputs) {
            if (theinputs[e].type == "password") {
                var n1 = theinputs[e];
                break;
            }
        }
        browser_element_focus(I.window.buffers.current, n1);
        type_manually(I,g_theloginpassword);
        var thebuttons = login_document.querySelectorAll("form button");
        var thebutton = thebuttons[0];
        thebutton.click();
    } else if ( g_theloginkey == "soundcloud" ) {
        I.window.minibuffer.message("soundcloud not supported");
    } else {
        // XXXX: some websites do not like the .value attribute being set directly
        //       hence the wierd copy/pasting
        if ( "login-id" in logindata[g_theloginkey] ) {
            var n1 = login_document.getElementById(logindata[g_theloginkey]["login-id"]);
            browser_element_focus(I.window.buffers.current, n1);
            type_manually(I,g_theloginuser);
        } else if ( "login-class" in logindata[g_theloginkey] ) {
            var n1 = login_document.getElementsByClassName(logindata[g_theloginkey]["login-class"])[0];
            browser_element_focus(I.window.buffers.current, n1);
            type_manually(I,g_theloginuser);
        } else if ( "login-element" in logindata[g_theloginkey] && "login-type" in logindata[g_theloginkey] ) {
            var theelements = login_document.querySelectorAll(logindata[g_theloginkey]["login-element"]);
            for (let e in theelements) {
                if (theelements[e].type == logindata[g_theloginkey]["login-type"]) {
                    var n1 = theelements[e];
                    break;
                }
            }
            browser_element_focus(I.window.buffers.current, n1);
            type_manually(I,g_theloginuser);
        } else if ( "login-element" in logindata[g_theloginkey] && "login-name" in logindata[g_theloginkey] ) {
            var theelements = login_document.querySelectorAll(logindata[g_theloginkey]["login-element"]);
            for (let e in theelements) {
                if (theelements[e].name == logindata[g_theloginkey]["login-name"]) {
                    var n1 = theelements[e];
                    break;
                }
            }
            browser_element_focus(I.window.buffers.current, n1);
            type_manually(I,g_theloginuser);
        }
        ////////////////////////////////////////////////////////////////////////////////
        if ( "password-id" in logindata[g_theloginkey] ) {
            var n2 = login_document.getElementById(logindata[g_theloginkey]["password-id"]);
            browser_element_focus(I.window.buffers.current, n2);
            type_manually(I,g_theloginpassword);
        } else if ( "password-class" in logindata[g_theloginkey] ) {
            var n2 = login_document.getElementsByClassName(logindata[g_theloginkey]["password-class"])[0];
            browser_element_focus(I.window.buffers.current, n2);
            type_manually(I,g_theloginpassword);
        } else if ( "password-element" in logindata[g_theloginkey] && "password-type" in logindata[g_theloginkey] ) {
            var theelements = login_document.querySelectorAll(logindata[g_theloginkey]["password-element"]);
            for (let e in theelements) {
                if (theelements[e].type == logindata[g_theloginkey]["password-type"]) {
                    var n1 = theelements[e];
                    break;
                }
            }
            browser_element_focus(I.window.buffers.current, n1);
            type_manually(I,g_theloginpassword);
        } else if ( "password-element" in logindata[g_theloginkey] && "password-name" in logindata[g_theloginkey] ) {
            var theelements = login_document.querySelectorAll(logindata[g_theloginkey]["password-element"]);
            for (let e in theelements) {
                if (theelements[e].name == logindata[g_theloginkey]["password-name"]) {
                    var n1 = theelements[e];
                    break;
                }
            }
            browser_element_focus(I.window.buffers.current, n1);
            type_manually(I,g_theloginpassword);
        }
        ////////////////////////////////////////////////////////////////////////////////
        if ( "submit-id" in logindata[g_theloginkey] ) {
            var thebutton = login_document.getElementById(logindata[g_theloginkey]["submit-id"]);
            thebutton.click();
        } else if ( "submit-class" in logindata[g_theloginkey] ) {
            var thebutton = login_document.getElementsByClassName(logindata[g_theloginkey]["submit-class"])[0];
            thebutton.click();
        } else if ( "submit-element" in logindata[g_theloginkey] && "submit-value" in logindata[g_theloginkey] ) {
            var theelements = login_document.querySelectorAll(logindata[g_theloginkey]["submit-element"]);
            // now find the value in the elements
            for (let e in theelements) {
                if (theelements[e].value == logindata[g_theloginkey]["submit-value"]) {
                    var thebutton = theelements[e];
                    break;
                }
            }
            thebutton.click();
        } else if ( "submit-element" in logindata[g_theloginkey] ) {
            // && "submit-type" in logindata[g_theloginkey]
            if ( "submit-narrow" in logindata[g_theloginkey] ) {
                var submit_document =login_document.querySelectorAll(logindata[g_theloginkey]["submit-narrow"])[0];
            } else {
                var submit_document=login_document;
            }
            var theelements = submit_document.querySelectorAll(logindata[g_theloginkey]["submit-element"]);
            // now find the value in the elements
            if ("submit-type" in logindata[g_theloginkey] ) {
                for (let e in theelements) {
                    if (theelements[e].type == logindata[g_theloginkey]["submit-type"]) {
                        var thebutton = theelements[e];
                        break;
                    }
                }
            } else {
                for (let e in theelements) {
                    var thebutton = theelements[e];
                    break;
                }
            }
            // TODO: this allows pcmastercard signin
            // I.window.alert(thebutton);
            thebutton.click();
        }
    }
};

function current_signout (I) {
    unfocus(I.window, I.window.buffers.current);
    g_thelogoutkey = null;
    g_thelogoutuser = null;
    g_thelogoutpassword = null;
    g_thelogouturi = null;
    // TODO: get the password here
    I.window.minibuffer.message("Looking up signout");
    var base64_currenturl=btoa(unescape(I.window.buffers.current.display_uri_string));
    var cmd_str="emacs -q --batch --eval '(progn (load \"~/.crypt-profiles-password-database.el\") (prin1 (crypt-profiles-get-matching-password \"" + base64_currenturl + "\")))'"
    // credit where credit is due
    // http://conkeror.org/Tips#Using_an_external_password_manager
    var out = "";
    var thepromise = spawn_process("/bin/bash",
                                   [null, "-c", cmd_str],
                                   null,
                                   [{output: async_binary_string_writer("")},
                                    {input:  async_binary_reader(function (s) out += s || "") }]);
    thepromise.then(function(returncode) {
        // TODO: not sure why slice is needed, there seems to be a spurious t coming out of emacs
        var thejson = eval(JSON.parse(out));
        // globals
        g_thelogoutkey = thejson[0];
        g_thelogoutuser = thejson[1];
        g_thelogoutpassword = thejson[2];
        var theurl = I.window.buffers.current.display_uri_string;
        if ( 'logout-url' in logindata[g_thelogoutkey]) {
            I.window.minibuffer.message("Logging out: " + g_thelogoutkey);
            g_thelogouturi=logindata[g_thelogoutkey]["logout-url"];
            var spec = load_spec(g_thelogouturi);
            I.window.buffers.current.load(spec);
        } else if (theurl.match(/twitter.com/)) {
            // https://twitter.com/logout except it confirms and have to press button anyways
            var thebutton =  I.window.buffers.current.document.getElementsByClassName("js-signout-button");
            if (typeof thebutton != "undefined" && typeof thebutton[0] != "undefined") {
                I.window.minibuffer.message("Logging out: " + g_thelogoutkey);
                thebutton[0].click();
            } else {
                I.window.minibuffer.message("Can't logout: " + g_thelogoutkey);
                // TODO: not sure why this is needed
                reload(I.window.buffers.current,true,null,null);
            }
        } else {
            I.window.minibuffer.message("No logout key for: " + g_thelogoutkey);
            reload(I.window.buffers.current,true,null,null);
        }
    });
    return thepromise;
}

interactive("insert-current-password","Get the current password and login for particular sites.",
    function (I) {
        insert_current_password(I);
    });

interactive("current-signout","Sign out from current website.",
    function (I) {
        remove_old_hooks(I);
        current_signout(I);
    });

var g_pass_database_successful=true;
