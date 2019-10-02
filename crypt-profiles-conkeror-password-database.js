/// crypt-profiles-conkeror-password-database.js
//
// Copyright (C) 2016-2019, Andrew Kroshko, all rights reserved.
//
// Author: Andrew Kroshko
// Maintainer: Andrew Kroshko <akroshko.public+devel@gmail.com>
// Created: Mon Jun 20, 2016
// Version: 20190929
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
////////////////////////////////////////////////////////////////////////
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
// TODO: Better format for g_logindata database.

// debug, leaks security badly but sometimes that has to be done
// var g_debug=true;
var g_debug=false;
// allow disabling in some circumstances
if (typeof g_disable_password_database == "undefined") {
    var g_disable_password_database=false;
}

// global variables
var g_password_database_successful=false;
var g_selection=null;
var g_theloginkey=null;
var g_theloginuser=null;
var g_theloginpassword=null;
var g_theloginuri=null;
var g_thelogoutkey=null;
var g_thelogoutuser=null;
var g_thelogouturi=null;
var g_initialstate=0;
// promises and hooks
var g_thedeferred_logout=null;
var g_thedeferred_logout_confirmation=null;
var g_thedeferred_login_page=null;
var g_the_deferred_login1=null;
var g_the_deferred_login2=null;
var g_thedeferred_timeout=null;

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

var g_logindata;
// allow defining this elsewhere
if (typeof g_logindata == "undefined") {
    g_logindata = {};
}

g_logindata["twitter"] =       {"url":"https://twitter.com/login/",
                                "login-class":"js-username-field email-input js-initial-focus",
                                "password-class":"js-password-field",
                                "submit-narrow":".signin-wrapper",
                                "submit-element":"button",
                                "submit-type":"submit",
                                "logout-url":"https://twitter.com/logout/"};
g_logindata["facebook"] =      {"url":"https://www.facebook.com/login.php",
                                "login-id":"email",
                                "password-id":"pass",
                                "submit-id":"loginbutton"};
g_logindata["gmail"] =         {"url":"https://accounts.google.com/ServiceLogin?sacu=1&scc=1&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&service=mail&ltmpl=default",
                                "logout-url":"https://mail.google.com/mail/logout?hl=en"};
g_logindata["youtube"] =       {"url":"https://accounts.google.com/ServiceLogin?service=youtube&sacu=1&continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26next%3D%252Ffeed%252Fsubscriptions%26hl%3Den-GB%26feature%3Dredirect_login",
                                "logout-url":"https://www.youtube.com/logout"};
g_logindata["instagram"] =     {"url":"https://www.instagram.com/accounts/login/?force_classic_login",
                                "login-id":"id_username",
                                'password-id':"id_password",
                                'submit-element':'input',
                                'submit-type':'submit',
                                "logout-url":"https://instagram.com/accounts/logout"};
g_logindata["amazonca"] =      {"url":"https://www.amazon.ca/ap/signin?_encoding=UTF8&openid.assoc_handle=caflex&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.ca%2Fgp%2Fcss%2Fhomepage.html%2Fref%3Dnav_signin",
                                "login-id":"ap_email",
                                "password-id":"ap_password",
                                "submit-id":"signInSubmit"};
g_logindata["amazoncom"] =     {"url":"https://www.amazon.com/ap/signin?_encoding=UTF8&openid.assoc_handle=usflex&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Fgp%2Fyourstore%2Fhome%3Fie%3DUTF8%26action%3Dsign-out%26path%3D%252Fgp%252Fyourstore%252Fhome%26ref_%3Dnav_youraccount_signout%26signIn%3D1%26useRedirectOnSuccess%3D1",
                                "login-id":"ap_email",
                                "password-id":"ap_password",
                                "submit-id":"signInSubmit"};
g_logindata["usask"] =         {"url":"https://pawscas.usask.ca/cas-web/login?service=https%3A%2F%2Fpaws5.usask.ca%2Fc%2Fportal%2Flogin",
                                "login-id":"username",
                                "password-id":"password",
                                "submit-class":"btn btn-primary btn-block mbmd",
                                "logout-url":"https://pawscas.usask.ca/cas-web/logout"};
g_logindata["tdcanadatrust"] = {"url":"https://easyweb.td.com/waw/idp/login.htm",
                                "login-id":"username100",
                                "password-id":"password"
                                // "submit-element":"button",
                                // "submit-type":"submit"
                               };
g_logindata["vimeo"] =         {"url":"https://vimeo.com/log_in",
                                "login-id":"signup_email",
                                "password-id":"login_password",
                                "submit-element":"input",
                                "submit-value":"Log in with email"};
g_logindata["pcmastercard"] =  {"url":"https://online.pcmastercard.ca/PCB_Consumer/Login.do?LAN=EN",
                                "login-id":"md-input-0",
                                "password-id":"md-input-1",
                                "submit-narrow":"form[name=login_form]",
                                "submit-element":"button"};
// TODO: needs a special function
g_logindata["mec"] =           {"url":"https://www.mec.ca/Membership/login.jsp",
                                "login-id":"j_username",
                                "password-id":"j_password",
                                "submit-class":"btn btn-primary btn-block js-btn-modal-sign-in js-form-submit"};
g_logindata["telusmobility"] = {"url":"https://telusidentity.telus.com/as/authorization.oauth2?client_id=uni_portal&response_type=code&scope=priceplaninfo+securitymgmt+usagedetails+profilemanagement+invoiceinfo+usagemanagement+accountactivity+subscriberinfo+paymentmanagement+paymentprocessing+accountinfo+devicemanagement+serviceeligibility+loyaltyandrewards+recommendationmanagement+profileinfohighdetail+usagepreferencemanagement+usagemeter+usagenotificationacceptancehistory+usageblockmanagement+tvrequisition+tvsusbscriptioninfo+internetservicemanagement+customerinfo&redirect_uri=https%3A%2F%2Fwww.telus.com%2Fmy-account%2Foauth_callback",
                                "login-id":"idtoken1",
                                "password-id":"idtoken2",
                                "submit-narrow":"form#login",
                                "submit-element":"button",
                                "submit-type":"submit"};
g_logindata["findmespot"] =    {"url":"https://login.findmespot.com/spot-main-web/auth/login.html",
                                "login-id":"j_username",
                                "password-id":"j_password",
                                "submit-id":"login"};
g_logindata["flickr"] =        {"url":"https://login.yahoo.com/config/login?.src=flickrsignin"};
g_logindata["github"] =        {"url":"https://github.com/login",
                                "login-id":"login_field",
                                "password-id":"password",
                                "submit-element":"input",
                                "submit-type":"submit",
                                // TODO: will need additional click
                                "logout-url":"https://github.com/logout"};
g_logindata["newegg"] =        {"url":"https://secure.newegg.ca/NewMyAccount/AccountLogin.aspx",
                                "login-id":"UserName",
                                "password-id":"UserPwd"// ,
                                // "submit-id":"submitLogin"
                               };
g_logindata["abebooks"] =      {"url":"https://www.abebooks.com/servlet/SignOnPL?msg=You+are+not+authorized+to+view+this+page.++Either+you+have+not+signed+on+or+you+are+trying+to+access+a+page+that+requires+a+higher+level+of+authority.&cm_sp=TopNav-_-Home-_-MMM&goto=MembersMainMenu%3F",
                                "login-id":"email",
                                "password-id":"password",
                                "submit-id":"signon-button"};
// TODO: here
g_logindata["memoryexpress"] = {"url":"https://www.memoryexpress.com/User/Login.aspx"};
g_logindata["clubtread"] =     {"url":"http://forums.clubtread.com/register.php",
                                "login-id":"navbar_username",
                                "password-id":"navbar_password",
                                "submit-class":"button"};
g_logindata["strava"] =        {"url":"https://www.strava.com/login",
                                "login-id":"email",
                                "password-id":"password",
                                "submit-id":"login-button"};
g_logindata["buyapi"] =        {"url":"https://www.buyapi.ca/my-account/",
                                "login-id":"username",
                                "password-id":"password",
                                "submit-class":"woocommerce-Button button"};
// TODO: nonfunctional, needs work, probably in some wierd iframe
g_logindata["digikey"] =       {"url":"https://www.digikey.ca/MyDigiKey/Login",
                                "login-id":"username",
                                "password-id":"password",
                                "submit-id":"btnPostLogin"};
g_logindata["ebay"]    =       {"url":"https://signin.ebay.ca/ws/eBayISAPI.dll?SignIn&ru=http%3A%2F%2Fwww.ebay.ca%2F",
                                "login-id":"userid",
                                "password-id":"pass",
                                "submit-id":"sgnBt"};
// TODO: submit can only be identified by inner html
g_logindata["twitch"]  =       {"url":"https://www.twitch.tv/login",
                                // "login-element":"input",
                                // "login-type":"text",
                                // "password-element":"input",
                                // "password-type":"password",
                                // "submit-element":"button"
                                // this avoids pulling up websites with spoilers from people I do not follow
                                "post-login-url":"https://www.twitch.tv/directory/following"};
g_logindata["discord"]    =    {"url":"https://discordapp.com/login",
                                "login-element":"input",
                                "login-type":"email",
                                "password-element":"input",
                                "password-type":"password",
                                "submit-element":"button",
                                "submit-type":"submit"};
g_logindata["deviantart"] =    {"url":"https://www.deviantart.com/users/login",
                                "login-id":"login_username",
                                "password-id":"login_password",
                                "submit-class":"smbutton smbutton-size-default smbutton-shadow smbutton-blue"}
g_logindata["linkedin"] =    {"url":"https://www.linkedin.com/uas/login?trk=guest_homepage-basic_nav-header-signin",
                              "login-id":"username",
                              "password-id":"password"
                              // ,
                              // "submit-class":"login-submit"
                             }
g_logindata["pixiv"] =    {"url":"https://accounts.pixiv.net/login?lang=en&source=pc&view_type=page"}
// TODO: might be an issue
g_logindata["soundcloud"] =    {"url":"https://soundcloud.com/signin"};
g_logindata["noip"] =          {"url":"https://www.noip.com/login",
                                "login-element":"input",
                                "login-type":"text",
                                "password-element":"input",
                                "password-type":"password",
                                "submit-element":"button",
                                "submit-type":"submit"};
g_logindata["kijiji"] =        {"url":"https://kijiji.ca/t-login.html",
                                "login-id":"LoginEmailOrNickname",
                                "password-id":"login-password",
                                "submit-id":"SignInButton"};
// TODO: nice
g_logindata["quora"] =    {"url":""};
g_logindata["steam"] =    {"url":"https://store.steampowered.com/login/?redir=&redir_ssl=1",
                           "login-id":"input_username",
                           "password-id":"input_password",
                           "submit-narrow":"div#login_btn_signin",
                           "submit-element":"button",
                           "submit-type":"submit"}
// TODO: non-functional, might have to wait for multiple reloads
g_logindata["psn"]   =    {"url":"https://account.sonyentertainmentnetwork.com/",
                           "login-id":"ember18",
                           "password-id":"ember20",
                           "submit-id":"ember22"}

define_key(content_buffer_normal_keymap, "s-`",     "current-signout");
function get_current_password_login(window, logintype, loginkey=false, open_new_buffer=false, login_here_only=false) {
    unfocus(window, window.buffers.current);
    window.minibuffer.message("Finding current login and password");
    g_theloginkey = null;
    g_theloginuser = null;
    g_theloginpassword = null;
    g_theloginuri = null;
    g_initialstate = null;
    var base64_currenturl=btoa(unescape(window.buffers.current.display_uri_string));
    if (loginkey==false) {
        var theloginkey="nil";
    } else {
        var theloginkey="\"" + loginkey + "\"";
    }
    if (logintype >= 2) {
        var cmd_str="emacs --no-init-file --batch --eval '(progn (load \"~/.crypt-profiles-password-database.el\") (prin1 (crypt-profiles-get-matching-password-obfusicated "+theloginkey+" \"" + base64_currenturl + "\" " + String(logintype) + ")))'"
    } else if (logintype == 1) {
        var cmd_str="emacs --no-init-file --batch --eval '(progn (load \"~/.crypt-profiles-password-database.el\") (prin1 (crypt-profiles-get-matching-password-obfusicated "+theloginkey+" \"" + base64_currenturl + "\")))'"
    } else {
        window.alert("Invalid logintype!");
    }
    if (g_debug==true) {
        dumpln("d: " + cmd_str);
    }
    window.minibuffer.message(cmd_str);
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
        window.minibuffer.message("Found login for: " + g_theloginkey);
        g_theloginuser = thejson[1];
        g_theloginpassword = get_password_obfusicated_json(thejson[2][0],thejson[2][1]);
        g_theloginuri = g_logindata[g_theloginkey]["url"];
        g_initialstate = 0;
        window.minibuffer.message("");
        var spec = load_spec(g_theloginuri);
        if (open_new_buffer == true) {
            browser_object_follow(window.buffers.current, OPEN_NEW_BUFFER, spec);
        } else if (login_here_only == true) {
            // TODO: not here
            // thepromise.resolve();
        } else {
            window.buffers.current.load(spec);
        }
        window.minibuffer.message("Going to login for: " + g_theloginkey);
    });
    return thepromise;
}

function logout_resolve_hook_function () {
    // TODO check if buffer is loading and correct one
    call_after_timeout(function () { g_thedeferred_logout.resolve() }, 500);
}

function logout_confirmation_resolve_hook_function () {
    // TODO check if buffer is loading and correct one
    // TODO: this is not great but seems to be necessary, where can I put more timeouts...
    call_after_timeout(function () { g_thedeferred_logout_confirmation.resolve() }, 500);
}

function login_page_resolve_hook_function () {
    // TODO check if buffer is loading and correct one
    // TODO: would love to add some delays in, but not yet
    call_after_timeout(function () { g_thedeferred_login_page.resolve() }, 500);
}

function login_resolve_hook_function1 () {
    // TODO check if buffer is loading and correct one
    call_after_timeout(function () { g_the_deferred_login1.resolve() }, 500);
}

function login_resolve_hook_function2 () {
    // TODO check if buffer is loading and correct one
    call_after_timeout(function () { g_the_deferred_login2.resolve() }, 500);
}

function timeout_resolve_callback () {
    call_after_timeout(function () { g_thedeferred_timeout.resolve() }, 500);
}

function auto_login (window, open_new_buffer=false, login_here_only=false) {
    if (open_new_buffer==true || login_here_only==true) {
        var thepromise_signout = new Promise(function(resolve, reject) {
            resolve();
        });
        var original_buffer=window.buffers.current;
    } else {
        var thepromise_signout=current_signout(window);
    }
    thepromise_signout.then(function(result) {
        g_thedeferred_logout=Promise.defer();
        if (login_here_only==true) {
            g_thedeferred_logout.resolve();
        } else {
            add_hook.call(window.buffers.current, "content_buffer_finished_loading_hook", logout_resolve_hook_function);
        }
        return g_thedeferred_logout.promise;
    }).then(function (result) {
        var thepromise=get_current_password_login(window,g_selection,false,open_new_buffer,login_here_only);
        return thepromise;
    }).then(function(result) {
        g_thedeferred_login_page=Promise.defer();
        if (login_here_only==true) {
            g_thedeferred_login_page.resolve();
        } else {
            add_hook.call(window.buffers.current, "content_buffer_finished_loading_hook", login_page_resolve_hook_function);
        }
        return g_thedeferred_login_page.promise;
    // XXXX: still non-functional, need to find way to do this, probably a callback that lets command return
    // }).then(function (result) {
    //     var g_thedeferred_timeout=Promise.defer();
    //     call_after_timeout(timeout_resolve_callback,10000);
    //     return g_thedeferred_timeout;
    }).then(function(result) {
        remove_hook.call(window.buffers.current,  "content_buffer_finished_loading_hook", login_page_resolve_hook_function);
        insert_current_password(window,login_here_only);
        g_the_deferred_login1=Promise.defer();
        if ( g_theloginkey == "gmail" || g_theloginkey == "youtube" ) {
            add_hook.call(window.buffers.current, "content_buffer_finished_loading_hook", login_resolve_hook_function1);
        } else {
            g_the_deferred_login1.resolve();
        }
        return g_the_deferred_login1.promise;
        // if (open_new_buffer==true) {
        //     // TODO: non-functional
        //     reload(window.buffers.current,true,null,null);
        // }
    }).then(function(result) {
        remove_hook.call(window.buffers.current,  "content_buffer_finished_loading_hook", login_resolve_hook_function1);
        insert_current_password(window,login_here_only);
        // TODO: non-functional way of going to a different page after login
        // TODO: will have to do something different with hooks
        // g_the_deferred_login2=Promise.defer();
        // if ( typeof g_logindata[g_theloginkey]["post-login-url"] != "undefined") {
        //     add_hook.call(window.buffers.current, "content_buffer_finished_loading_hook", login_resolve_hook_function2);
        // } else {
        //     g_the_deferred_login2.resolve();
        // }
        // return g_the_deferred_login2;
    // }).then(function (result) {
    //     if ( typeof g_logindata[g_theloginkey]["post-login-url"] != "undefined") {
    //         var spec = load_spec(g_logindata[g_theloginkey]["post-login-url"]);
    //         window.buffers.current.load(spec);
    //     }
    });
    yield co_return(thepromise_signout);
}

function get_current_password_login_only(window,number,loginkey=false) {
    if (check_password_database_disabled(window) == false) {
        var thepromise=get_current_password_login(window,number,loginkey);
        window.minibuffer.message("Use (C-x l) to enter login and (C-x p) to enter password;");
        return thepromise;
    }
}

interactive("get-current-password-login-1","Get the login for the primary acount for particular sites.",
    function (I) {
        get_current_password_login_only(I.window,1)
    });

interactive("insert-stored-login","Insert the stored login.",
    function (I) {
        if (check_password_database_disabled(I.window) == false) {
            type_manually(I.window,g_theloginuser);
        }
    });
define_key(content_buffer_form_keymap, "C-x l", "insert-stored-login");
define_key(content_buffer_text_keymap, "C-x l", "insert-stored-login");

interactive("insert-stored-password","Insert the stored password.",
    function (I) {
        if (check_password_database_disabled(I.window) == false) {
            type_manually(I.window,g_theloginpassword);
        }
    });
define_key(content_buffer_form_keymap, "C-x p", "insert-stored-password");
define_key(content_buffer_text_keymap, "C-x p", "insert-stored-password");

interactive("auto-login-1","Login to primary fully automatically.",
    function (I) {
        if (check_password_database_disabled(I.window) == false) {
            remove_old_hooks(I.window);
            g_selection=1;
            yield auto_login(I.window);
        }
    });
define_key(content_buffer_normal_keymap, "s-1", "auto-login-1");
define_key(minibuffer_keymap,            "s-1", "minibuffer-abort");

// TODO: does not work yet, logout screws up things and hooks wrong buffer
interactive("auto-login-new-buffer-1","Login to primary fully automatically, keep current buffer and login on new buffer.",
    function (I) {
        if (check_password_database_disabled(I.window) == false) {
            remove_old_hooks(I.window);
            g_selection=1;
            yield auto_login(I.window,true);
        }
    });
define_key(content_buffer_normal_keymap, "C-c s-1", "auto-login-new-buffer-1");
define_key(minibuffer_keymap,            "C-c s-1", "minibuffer-abort");
interactive("auto-login-here-1","Login to primary fully automatically, keep current buffer and login on new buffer.",
    function (I) {
        if (check_password_database_disabled(I.window) == false) {
            remove_old_hooks(I.window);
            g_selection=1;
            yield auto_login(I.window,false,true);
        }
    });
define_key(content_buffer_normal_keymap, "C-u s-1", "auto-login-here-1");
define_key(minibuffer_keymap,            "C-u s-1", "minibuffer-abort");
define_key(content_buffer_normal_keymap, "C-x s-1", "get-current-password-login-1");

interactive("get-login-select-1","Select the login to do.",
    function (I) {
        remove_old_hooks(I.window);
        var loginkey = yield I.minibuffer.read(
            $prompt = "Login: ",
            $completer = new all_word_completer($completions = Object.keys(g_logindata).sort(),
                                                $get_string = function (x) x,
                                                $get_description = function (x) g_logindata[x]["url"],
                                                $get_value = function (x) x),
            $auto_complete = true,
            $auto_complete_initial = true,
            $auto_complete_delay = 0,
            $require_match = true);
        var loginurl=g_logindata[loginkey]["url"];
        g_selection=1;
        get_current_password_login_only(I.window,1,loginkey=loginkey);
    }
);
define_key(content_buffer_normal_keymap, "s-j s-1", "get-login-select-1");

interactive("get-current-password-login-2","Get the login for the secondary account for particular sites.",
    function (I) {
        if (check_password_database_disabled(I.window) == false) {
            var thepromise=get_current_password_login_only(I.window,2);
        }
    });

interactive("auto-login-2","Login to account profile 2 fully automatically.",
    function (I) {
        if (check_password_database_disabled(I.window) == false) {
            remove_old_hooks(I.window);
            g_selection=2;
            yield auto_login(I.window);
        }
    });
define_key(content_buffer_normal_keymap, "s-2", "auto-login-2");
define_key(minibuffer_keymap,            "s-2", "minibuffer-abort");
define_key(content_buffer_normal_keymap, "C-x s-2", "get-current-password-login-2");

interactive("auto-login-new-buffer-2","Login to account profile 2 fully automatically.",
    function (I) {
        if (check_password_database_disabled(I.window) == false) {
            remove_old_hooks(I.window);
            g_selection=2;
            yield auto_login(I.window,true);
        }
    });
interactive("auto-login-here-2","Login to primary fully automatically, keep current buffer and login on new buffer.",
    function (I) {
        if (check_password_database_disabled(I.window) == false) {
            remove_old_hooks(I.window);
            g_selection=2;
            yield auto_login(I.window,false,true);
        }
    });
define_key(content_buffer_normal_keymap, "C-u s-2", "auto-login-here-2");
define_key(minibuffer_keymap,            "C-u s-2", "minibuffer-abort");
define_key(content_buffer_normal_keymap, "C-c s-2", "auto-login-new-buffer-2");
define_key(minibuffer_keymap,            "C-c s-2", "minibuffer-abort");

interactive("get-login-select-2","Select the login to do.",
    function (I) {
        remove_old_hooks(I.window);
        var loginkey = yield I.minibuffer.read(
            $prompt = "Login: ",
            $completer = new all_word_completer($completions = Object.keys(g_logindata).sort(),
                                                $get_string = function (x) x,
                                                $get_description = function (x) g_logindata[x]["url"],
                                                $get_value = function (x) x),
            $auto_complete = true,
            $auto_complete_initial = true,
            $auto_complete_delay = 0,
            $require_match = true);
        var loginurl=g_logindata[loginkey]["url"];
        g_selection=2;
        get_current_password_login_only(I.window,2,loginkey=loginkey);
    }
);
define_key(content_buffer_normal_keymap, "s-j s-2", "get-login-select-2");

interactive("get-current-password-login-3","Get the login for the tertiary acount for particular sites.",
    function (I) {
        if (check_password_database_disabled(I.window) == false) {
            var thepromise=get_current_password_login_only(I.window,3);
        }
    });

interactive("auto-login-3","Login to account profile 3 fully automatically.",
    function (I) {
        if (check_password_database_disabled(I.window) == false) {
            remove_old_hooks(I.window);
            g_selection=3;
            yield auto_login(I.window);
        }
    });
define_key(content_buffer_normal_keymap, "s-3", "auto-login-3");
define_key(minibuffer_keymap,            "s-3", "minibuffer-abort");
define_key(content_buffer_normal_keymap, "C-x s-3", "get-current-password-login-3");

interactive("auto-login-new-buffer-3","Login to account profile 3 fully automatically.",
    function (I) {
        if (check_password_database_disabled(I.window) == false) {
            remove_old_hooks(I.window);
            g_selection=3;
            yield auto_login(I.window,true);
        }
    });
interactive("auto-login-here-3","Login to primary fully automatically, keep current buffer and login on new buffer.",
    function (I) {
        if (check_password_database_disabled(I.window) == false) {
            remove_old_hooks(I.window);
            g_selection=3;
            yield auto_login(I.window,false,true);
        }
    });
define_key(content_buffer_normal_keymap, "C-u s-3", "auto-login-here-3");
define_key(minibuffer_keymap,            "C-u s-3", "minibuffer-abort");
define_key(content_buffer_normal_keymap, "C-c s-3", "auto-login-new-buffer-3");
define_key(minibuffer_keymap,            "C-c s-3", "minibuffer-abort");

interactive("get-login-select-3","Select the login to do.",
    function (I) {
        remove_old_hooks(I.window);
        var loginkey = yield I.minibuffer.read(
            $prompt = "Login: ",
            $completer = new all_word_completer($completions = Object.keys(g_logindata).sort(),
                                                $get_string = function (x) x,
                                                $get_description = function (x) g_logindata[x]["url"],
                                                $get_value = function (x) x),
            $auto_complete = true,
            $auto_complete_initial = true,
            $auto_complete_delay = 0,
            $require_match = true);
        var loginurl=g_logindata[loginkey]["url"];
        g_selection=3;
        get_current_password_login_only(I.window,3,loginkey=loginkey);
    }
);
define_key(content_buffer_normal_keymap, "s-j s-3", "get-login-select-3");

interactive("auto-login-4","Login to account profile 4 fully automatically.",
    function (I) {
        if (check_password_database_disabled(I.window) == false) {
            remove_old_hooks(I.window);
            g_selection=4;
            yield auto_login(I.window);
        }
    });
define_key(content_buffer_normal_keymap, "s-4", "auto-login-4");
define_key(minibuffer_keymap,            "s-4", "minibuffer-abort");

interactive("auto-login-new-buffer-4","Login to account profile 4 fully automatically.",
    function (I) {
        if (check_password_database_disabled(I.window) == false) {
            remove_old_hooks(I.window);
            g_selection=4;
            yield auto_login(I.window,true);
        }
    });
define_key(content_buffer_normal_keymap, "C-c s-4", "auto-login-new-buffer-4");
define_key(minibuffer_keymap,            "C-c s-4", "minibuffer-abort");

interactive("auto-login-5","Login to account profile 5 fully automatically.",
    function (I) {
        if (check_password_database_disabled(I.window) == false) {
            remove_old_hooks(I.window);
            g_selection=5;
            yield auto_login(I.window);
        }
    });
define_key(content_buffer_normal_keymap, "s-5", "auto-login-5");
define_key(minibuffer_keymap,            "s-5", "minibuffer-abort");

interactive("auto-login-new-buffer-5","Login to account profile 5 fully automatically.",
    function (I) {
        if (check_password_database_disabled(I.window) == false) {
            remove_old_hooks(I.window);
            g_selection=5;
            yield auto_login(I.window,true);
        }
    });
define_key(content_buffer_normal_keymap, "C-c s-5", "auto-login-new-buffer-5");
define_key(minibuffer_keymap,            "C-c s-5", "minibuffer-abort");

interactive("auto-login-6","Login to account profile 6 fully automatically.",
    function (I) {
        if (check_password_database_disabled(I.window) == false) {
            remove_old_hooks(I.window);
            g_selection=6;
            yield auto_login(I.window);
        }
    });
define_key(content_buffer_normal_keymap, "s-6", "auto-login-6");
define_key(minibuffer_keymap,            "s-6", "minibuffer-abort");

interactive("auto-login-new-buffer-6","Login to account profile 6 fully automatically.",
    function (I) {
        if (check_password_database_disabled(I.window) == false) {
            remove_old_hooks(I.window);
            g_selection=6;
            yield auto_login(I.window,true);
        }
    });
define_key(content_buffer_normal_keymap, "C-c s-6", "auto-login-new-buffer-6");
define_key(minibuffer_keymap,            "C-c s-6", "minibuffer-abort");

interactive("auto-login-11","Login to account profile 11 fully automatically.",
    function (I) {
        if (check_password_database_disabled(I.window) == false) {
            remove_old_hooks(I.window);
            g_selection=11;
            yield auto_login(I.window);
        }
    });
define_key(content_buffer_normal_keymap, "s-f1", "auto-login-11");
define_key(minibuffer_keymap,            "s-f1", "minibuffer-abort");

interactive("auto-login-new-buffer-11","Login to account profile 11 fully automatically.",
    function (I) {
        if (check_password_database_disabled(I.window) == false) {
            remove_old_hooks(I.window);
            g_selection=11;
            yield auto_login(I.window,true);
        }
    });
define_key(content_buffer_normal_keymap, "C-c s-f1", "auto-login-new-buffer-11");
define_key(minibuffer_keymap,            "C-c s-f1", "minibuffer-abort");

interactive("auto-login-12","Login to account profile 12 fully automatically.",
    function (I) {
        if (check_password_database_disabled(I.window) == false) {
            remove_old_hooks(I.window);
            g_selection=12;
            yield auto_login(I.window);
        }
    });
define_key(content_buffer_normal_keymap, "s-f2", "auto-login-12");
define_key(minibuffer_keymap,            "s-f2", "minibuffer-abort");

interactive("auto-login--new-buffer-12","Login to account profile 12 fully automatically.",
    function (I) {
        if (check_password_database_disabled(I.Iwindow) == false) {
            remove_old_hooks(I.window);
            g_selection=12;
            yield auto_login(I.window,true);
        }
    });
define_key(content_buffer_normal_keymap, "C-c s-f2", "auto-login--new-buffer-12");
define_key(minibuffer_keymap,            "C-c s-f2", "minibuffer-abort");

function remove_old_hooks(window) {
    remove_hook.call(window.buffers.current, "content_buffer_finished_loading_hook", logout_resolve_hook_function);
    remove_hook.call(window.buffers.current, "content_buffer_finished_loading_hook", logout_confirmation_resolve_hook_function);
    remove_hook.call(window.buffers.current, "content_buffer_finished_loading_hook", login_page_resolve_hook_function);
    remove_hook.call(window.buffers.current, "content_buffer_finished_loading_hook", login_resolve_hook_function1);
    remove_hook.call(window.buffers.current, "content_buffer_finished_loading_hook", login_resolve_hook_function2);
}

function type_manually(window,thestring) {
    sleep(100.0);
    var current_focused_element=window.buffers.current.focused_element;
    send_key_as_event(window,
                      current_focused_element,
                      'C-a');
    sleep(100.0+Math.random()*100.0);
    send_key_as_event(window,
                      current_focused_element,
                      'C-k');
    sleep(100.0+Math.random()*100.0);
    for (let thec in thestring) {
        send_key_as_event(window,
                          current_focused_element,
                          thestring[thec]);
        // TODO: use timeouts and async for this
        //       sleep locks up browser, so might be an issue with how this looks
        // I was getting many queries about being a real person at one point,
        // so add a bit of randomness to keystroke entry
        sleep(20.0 + Math.random()*30.0);
    }
    sleep(100.0);
}

function type_manually_with_timeout(window,thestring,final_callback) {
    var total_time=100.0;
    var current_focused_element=window.buffers.current.focused_element;
    for (let thec in thestring) {
        var temptime=50.0 + Math.random()*60.0
        total_time+=temptime;
        call_after_timeout(function () {
            send_key_as_event(window,
                              current_focused_element,
                              thestring[thec]);
            },total_time);
    }
    final_callback(window);
}

function insert_current_password (window,login_here_only=false) {
    // TODO: these are like this because I was testing something
    unfocus(window, window.buffers.current);
    window.minibuffer.message("Entering login and password for: " + g_theloginkey);
    var login_document=window.buffers.current.document;

    if ( g_theloginkey == "gmail" || g_theloginkey == "youtube" ) {
        var n1 = login_document.getElementById("Email");
        if ( n1 == null || n1.readOnly == true ) {
            var n2 = login_document.getElementById("Passwd");
            browser_element_focus(window.buffers.current, n2);
            type_manually(window,g_theloginpassword);
            if (login_here_only==false) {
                var theform = login_document.getElementsByClassName("rc-button rc-button-submit");
                theform[0].click();
            }
        } else {
            browser_element_focus(window.buffers.current, n1);
            type_manually(window,g_theloginuser);
            if (login_here_only==false) {
                var theform = login_document.getElementsByClassName("rc-button rc-button-submit");
                theform[0].click();
            }
        }
    } else if ( g_theloginkey == "flickr" ) {
        // TODO: have to fix this
        var n1 = login_document.getElementById("login-username");
        if ( n1 == null || g_initialstate == 1 ) {
            var n2 = login_document.getElementById("login-passwd");
            browser_element_focus(window.buffers.current, n2);
            type_manually(window,g_theloginpassword);
            if (login_here_only==false) {
                var theform = login_document.getElementById("login-signin");
                theform.click();
            }
        } else {
            browser_element_focus(window.buffers.current, n1);
            type_manually(window,g_theloginuser);
            g_initialstate = 1;
            if (login_here_only==false) {
                var theform = login_document.getElementById("login-signin");
                theform.click();
            }
        }
    } else if ( g_theloginkey == "amazonca" || g_theloginkey == "amazoncom" ) {
        var n1 = login_document.getElementById("ap_email");
        var n2 = login_document.getElementById("ap_password");
        if ( n1 == null ) {
            browser_element_focus(window.buffers.current, n2);
            type_manually(window,g_theloginpassword);
            if (login_here_only==false) {
                var theform = login_document.getElementById("signInSubmit");
                theform.click();
            }
        } else {
            browser_element_focus(window.buffers.current, n1);
            type_manually(window,g_theloginuser);
            browser_element_focus(window.buffers.current, n2);
            type_manually(window,g_theloginpassword);
            if (login_here_only==false) {
                var theform = login_document.getElementById("signInSubmit");
                theform.click();
            }
        }
    } else if ( g_theloginkey == "pixiv" ) {
        var n1_container = login_document.getElementById("container-login");
        var n1_container_inner = n1_container.getElementsByTagName("input")[0];
        browser_element_focus(window.buffers.current, n1_container_inner);
        n1_container_inner.value = g_theloginuser;
        // type_manually(window,g_theloginuser);
        var n1_container_inner = n1_container.getElementsByTagName("input")[1];
        browser_element_focus(window.buffers.current, n1_container_inner);
        n1_container_inner.value = g_theloginpassword;
        // type_manually(window,g_theloginpassword);
        // if (login_here_only==false) {
        //     var thebutton = login_document.getElementsByClassName("signup-form__submit");
        //     thebutton[0].click();
        // }
    } else if ( g_theloginkey == "digikey" ) {
        // https://www.w3schools.com/jsref/prop_frame_contentdocument.asp
        // TODO: make more universal for dealing with logins with frames
        var outer_frame = login_document.getElementById("frmLogin");
        var outer_or = (outer_frame.contentWindow || outer_frame.contentDocument);
        var outer = outer_or.document;
        var n1 = outer.getElementById("username");
        browser_element_focus(window.buffers.current, n1);
        type_manually(window,g_theloginuser);
        var n2 = outer.getElementById("password");
        browser_element_focus(window.buffers.current, n2);
        type_manually(window,g_theloginpassword);
        if (login_here_only==false) {
            var thebutton = outer.getElementById("btnPostLogin");
            thebutton.click();
        }
    } else if ( g_theloginkey == "twitch" ) {
        var theinputs = login_document.querySelectorAll("form input");
        for (let e in theinputs) {
            if (theinputs[e].type == "text") {
                var n1 = theinputs[e];
                break;
            }
        }
        browser_element_focus(window.buffers.current, n1);
        type_manually(window,g_theloginuser);
        for (let e in theinputs) {
            if (theinputs[e].type == "password") {
                var n1 = theinputs[e];
                break;
            }
        }
        browser_element_focus(window.buffers.current, n1);
        type_manually(window,g_theloginpassword);
        if (login_here_only==false) {
            var thebuttons = login_document.querySelectorAll("form button");
            var thebutton = thebuttons[0];
            thebutton.click();
        }
    } else if ( g_theloginkey == "soundcloud" ) {
        window.minibuffer.message("soundcloud not supported");
    } else {
        // XXXX: some websites do not like the .value attribute being set directly
        //       hence the wierd copy/pasting
        if ( "login-id" in g_logindata[g_theloginkey] ) {
            var n1 = login_document.getElementById(g_logindata[g_theloginkey]["login-id"]);
            browser_element_focus(window.buffers.current, n1);
            type_manually(window,g_theloginuser);
        } else if ( "login-class" in g_logindata[g_theloginkey] ) {
            var n1 = login_document.getElementsByClassName(g_logindata[g_theloginkey]["login-class"])[0];
            browser_element_focus(window.buffers.current, n1);
            type_manually(window,g_theloginuser);
        } else if ( "login-element" in g_logindata[g_theloginkey] && "login-type" in g_logindata[g_theloginkey] ) {
            var theelements = login_document.querySelectorAll(g_logindata[g_theloginkey]["login-element"]);
            for (let e in theelements) {
                if (theelements[e].type == g_logindata[g_theloginkey]["login-type"]) {
                    var n1 = theelements[e];
                    break;
                }
            }
            browser_element_focus(window.buffers.current, n1);
            type_manually(window,g_theloginuser);
        } else if ( "login-element" in g_logindata[g_theloginkey] && "login-name" in g_logindata[g_theloginkey] ) {
            var theelements = login_document.querySelectorAll(g_logindata[g_theloginkey]["login-element"]);
            for (let e in theelements) {
                if (theelements[e].name == g_logindata[g_theloginkey]["login-name"]) {
                    var n1 = theelements[e];
                    break;
                }
            }
            browser_element_focus(window.buffers.current, n1);
            type_manually(window,g_theloginuser);
        }
        ////////////////////////////////////////////////////////////////////////////////
        if ( "password-id" in g_logindata[g_theloginkey] ) {
            var n2 = login_document.getElementById(g_logindata[g_theloginkey]["password-id"]);
            browser_element_focus(window.buffers.current, n2);
            type_manually(window,g_theloginpassword);
        } else if ( "password-class" in g_logindata[g_theloginkey] ) {
            var n2 = login_document.getElementsByClassName(g_logindata[g_theloginkey]["password-class"])[0];
            browser_element_focus(window.buffers.current, n2);
            type_manually(window,g_theloginpassword);
        } else if ( "password-element" in g_logindata[g_theloginkey] && "password-type" in g_logindata[g_theloginkey] ) {
            var theelements = login_document.querySelectorAll(g_logindata[g_theloginkey]["password-element"]);
            for (let e in theelements) {
                if (theelements[e].type == g_logindata[g_theloginkey]["password-type"]) {
                    var n1 = theelements[e];
                    break;
                }
            }
            browser_element_focus(window.buffers.current, n1);
            type_manually(window,g_theloginpassword);
        } else if ( "password-element" in g_logindata[g_theloginkey] && "password-name" in g_logindata[g_theloginkey] ) {
            var theelements = login_document.querySelectorAll(g_logindata[g_theloginkey]["password-element"]);
            for (let e in theelements) {
                if (theelements[e].name == g_logindata[g_theloginkey]["password-name"]) {
                    var n1 = theelements[e];
                    break;
                }
            }
            browser_element_focus(window.buffers.current, n1);
            type_manually(window,g_theloginpassword);
        }
        ////////////////////////////////////////////////////////////////////////////////
        if (login_here_only==false) {
            if ( "submit-id" in g_logindata[g_theloginkey] ) {
                var thebutton = login_document.getElementById(g_logindata[g_theloginkey]["submit-id"]);
                thebutton.click();
            } else if ( "submit-class" in g_logindata[g_theloginkey] ) {
                var thebutton = login_document.getElementsByClassName(g_logindata[g_theloginkey]["submit-class"])[0];
                thebutton.click();
            } else if ( "submit-element" in g_logindata[g_theloginkey] && "submit-value" in g_logindata[g_theloginkey] ) {
                var theelements = login_document.querySelectorAll(g_logindata[g_theloginkey]["submit-element"]);
                // now find the value in the elements
                for (let e in theelements) {
                    if (theelements[e].value == g_logindata[g_theloginkey]["submit-value"]) {
                        var thebutton = theelements[e];
                        break;
                    }
                }
                thebutton.click();
            } else if ( "submit-element" in g_logindata[g_theloginkey] ) {
                // && "submit-type" in g_logindata[g_theloginkey]
                if ( "submit-narrow" in g_logindata[g_theloginkey] ) {
                    var submit_document =login_document.querySelectorAll(g_logindata[g_theloginkey]["submit-narrow"])[0];
                } else {
                    var submit_document=login_document;
                }
                var theelements = submit_document.querySelectorAll(g_logindata[g_theloginkey]["submit-element"]);
                // now find the value in the elements
                if ("submit-type" in g_logindata[g_theloginkey] ) {
                    for (let e in theelements) {
                        if (theelements[e].type == g_logindata[g_theloginkey]["submit-type"]) {
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
                // TODO: this allows pcmastercard signin, which actually broke again
                // window.alert(thebutton);
                thebutton.click();
            }
        }
    }
};

function current_signout (window) {
    unfocus(window, window.buffers.current);
    g_thelogoutkey = null;
    g_thelogoutuser = null;
    g_thelogouturi = null;
    // TODO: get the password here
    window.minibuffer.message("Looking up signout");
    var base64_currenturl=btoa(unescape(window.buffers.current.display_uri_string));
    var cmd_str="emacs --no-init-file --batch --eval '(progn (load \"~/.crypt-profiles-password-database.el\") (prin1 (crypt-profiles-get-matching-password-obfusicated nil \"" + base64_currenturl + "\")))'";
    if (g_debug==true) {
        dumpln("d: " + cmd_str);
    }
    // credit where credit is due
    // http://conkeror.org/Tips#Using_an_external_password_manager
    var out = "";
    var thepromise = spawn_process("/bin/bash",
                                   [null, "-c", cmd_str],
                                   null,
                                   [{output: async_binary_string_writer("")},
                                    {input:  async_binary_reader(function (s) out += s || "") }]);
    thepromise.then( function(returncode) {
        g_thedeferred_logout_confirmation = Promise.defer();
        // TODO: not sure why slice is needed, there seems to be a spurious t coming out of emacs
        var thejson = eval(JSON.parse(out));
        // globals
        g_thelogoutkey = thejson[0];
        g_thelogoutuser = thejson[1];
        if ( g_thelogoutkey == "twitter" ) {
            window.minibuffer.message("Logging out specially: " + g_thelogoutkey);
            g_thelogouturi=g_logindata[g_thelogoutkey]["logout-url"];
            var spec = load_spec(g_thelogouturi);
            window.buffers.current.load(spec);
            add_hook.call(window.buffers.current, "content_buffer_finished_loading_hook", logout_confirmation_resolve_hook_function);
        } else if ('logout-url' in g_logindata[g_thelogoutkey]) {
            g_thedeferred_logout_confirmation.resolve();
            window.minibuffer.message("Logging out: " + g_thelogoutkey);
            g_thelogouturi=g_logindata[g_thelogoutkey]["logout-url"];
            var spec = load_spec(g_thelogouturi);
            window.buffers.current.load(spec);
        } else {
            g_thedeferred_logout_confirmation.resolve();
            window.minibuffer.message("No logout key for: " + g_thelogoutkey);
            reload(window.buffers.current,true,null,null);
        }
        return g_thedeferred_logout_confirmation.promise;
    }).then( function(returncode) {
        if ( g_thelogoutkey == "twitter" ) {
            remove_hook.call(window.buffers.current,  "content_buffer_finished_loading_hook", logout_confirmation_resolve_hook_function);
            var theelements = window.buffers.current.document.querySelectorAll('span');
            var theelement = null;
            // this is inefficient to go over all span selectors, but I don't know any other way
            for (let e in theelements) {
                if (typeof theelements[e].innerHTML != "undefined" && theelements[e].innerHTML == "Log out") {
                    theelement=theelements[e];
                }
            }
            if (theelement != null) {
                theelement.click();
            }
        }
    });
    return thepromise;
}

interactive("insert-current-password","Get the current password and login for particular sites.",
    function (I) {
        if (check_password_database_disabled(I) == false) {
            insert_current_password(I.window);
        }
    });

interactive("current-signout","Sign out from current website.",
    function (I) {
        if (check_password_database_disabled(I) == false) {
            remove_old_hooks(I.window);
            current_signout(I.window);
        }
    });

interactive("test-login-obfusicated","Test obfusicated passwords.",
    function (I) {
        if (check_password_database_disabled(I) == false) {
            insert_current_password(I.window);
            unfocus(I.window, I.window.buffers.current);
            I.window.minibuffer.message("Looking up signout");
            var base64_currenturl=btoa(unescape(I.window.buffers.current.display_uri_string));
            var cmd_str="emacs --no-init-file --batch --eval '(progn (load \"~/.crypt-profiles-password-database.el\") (prin1 (crypt-profiles-get-matching-password-obfusicated \"" + base64_currenturl + "\")))'";
            if (g_debug==true) {
                dumpln("d: " + cmd_str);
            }
            // credit where credit is due
            // http://conkeror.org/Tips#Using_an_external_password_manager
            var out = "";
            var thepromise = spawn_process("/bin/bash",
                                           [null, "-c", cmd_str],
                                           null,
                                           [{output: async_binary_string_writer("")},
                                            {input:  async_binary_reader(function (s) out += s || "") }]);
            thepromise.then(function(returncode) {
                var thejson = eval(JSON.parse(out));
                // turn password into garbage
                if (g_debug==true) {
                    dumpln("d: " + thejson[0]);
                    dumpln("d: " + thejson[1]);
                    dumpln("d: " + thejson[2][0]);
                    dumpln("d: " + thejson[2][1]);
                }
                var thepassword=get_password_obfusicated_json(thejson[2][0],thejson[2][1]);
                if (g_debug==true) {
                    dumpln("d: " + thepassword);
                }})}
});

function get_password_obfusicated_json(thekeys,thedata) {
    var thepassword="";
    if (g_debug==true) {
        dumpln("d: " + thekeys);
    }
    for (let thekey in thekeys) {
        if (g_debug==true) {
            dumpln("d: " + thekey);
        }
        thepassword = thepassword + thedata[thekeys[thekey]][0];
        if (g_debug==true) {
            dumpln("d: " + thepassword);
        }
    }
    return thepassword;
}

function check_password_database_disabled (window) {
    if (g_disable_password_database == true) {
        window.minibuffer.message("Password database disabled by global variable g_disable_password_database!");
        return true;
    } else {
        return false;
    }
}

var g_password_database_successful=true;
