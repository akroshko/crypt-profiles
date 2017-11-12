// TODO: if true is a placeholder for more configurability later
var startTime = new Date();
if (true) {
    // security stuff
    // https://vikingvpn.com/cybersecurity-wiki/browser-security/guide-hardening-mozilla-firefox-for-privacy-and-security
    // TODO: these are not in ghacks
    session_pref("xpinstall.signatures.required",false);
    session_pref("security.ssl3.ecdhe_ecdsa_rc4_128_sha",false);
    session_pref("security.ssl3.ecdhe_rsa_rc4_128_sha",false);
    session_pref("security.ssl3.rsa_rc4_128_md5",false);
    session_pref("security.ssl3.rsa_rc4_128_sha",false);
    // TODO: I never use this, down below but commented
    session_pref("browser.formfill.enable",false);
    // TODO: check what this is...
    session_pref("plugin.scan.plid.all",false);

    // https://gist.github.com/haasn/69e19fc2fe0e25f3cff5
    // TODO: prefetching
    session_pref("dom.event.clipboardevents.enabled",false);
    session_pref("dom.battery.enabled",false);
    session_pref("loop.enabled",false);
    // TODO: what is this, see https://gist.github.com/haasn/69e19fc2fe0e25f3cff5
    session_pref("browser.beacen.enabled",false);
    // TODO: go back to ghacks user.js
    session_pref("geo.enabled",false);
    session_pref("geo.wifi.logging.enabled",false);
    session_pref("geo.wifi.uri","");
    // TODO: browser.safebrowsing.enabled, why not in ghacks
    session_pref("browser.safebrowsing.enabled",false);
    session_pref("browser.safebrowsing.downloads.enabled",false);
    session_pref("browser.safebrowsing.malware.enabled",false);
    // TODO: not around...?
    session_pref("media.block-autoplay-until-in-foreground",true);
    session_pref("social.manifest.facebook","");
    session_pref("device.sensors.enabled",false);
    session_pref("camera.control.autofocus_moving_callback.enabled",false);
    // network.http.speculative-parallel-limit=0
    // TODO: should I add below
    session_pref("security.tls.insecure_fallback_hosts.use_static_list",false);
    // TOOD: hmmmm....
    session_pref("security.tls.version.min",1);
    // TODO: change in future when I don't need to connect to certain unsafe websites
    // https://wiki.mozilla.org/Security:Renegotiation#security.ssl.require_safe_negotiation
    // session_pref("security.ssl.require_safe_negotiation",true);
    // TODO: does not seem to affect conkeror
    // session_pref("security.ssl.treat_unsafe_negotiation_as_broken",true);
    session_pref("security.ssl3.rsa_seed_sha",true);
    // TODO: change below
    session_pref("security.OCSP.enabled",1);
    session_pref("security.OCSP.require",true);
    // perfect forward secrecy, but muight break many things
    // session_pref("security.ssl3.rsa_aes_256_sha",false);
    // TODO: better, but some of my websites won't work
    // session_pref("security.tls.version.min",3);

    /*** 0100: STARTUP ***/
    session_pref("ghacks_user.js.parrot", "0100 syntax error: the parrot's dead!");
    // 0101: disable "slow startup" options
       // warnings, disk history, welcomes, intros, EULA, default browser check
    session_pref("browser.slowStartup.notificationDisabled", true);
    session_pref("browser.slowStartup.maxSamples", 0);
    session_pref("browser.slowStartup.samples", 0);
    session_pref("browser.rights.3.shown", true);
    session_pref("browser.startup.homepage_override.mstone", "ignore");
    session_pref("startup.homepage_welcome_url", "");
    session_pref("startup.homepage_welcome_url.additional", "");
    session_pref("startup.homepage_override_url", "");
    session_pref("browser.laterrun.enabled", false);
    session_pref("browser.shell.checkDefaultBrowser", false);
    session_pref("browser.usedOnWindows10.introURL", "");
    // 0102: set start page (0=blank, 1=home, 2=last visited page, 3=resume previous session)
       // home = browser.startup.homepage preference
       // You can set all of this from Options>General>Startup
       // session_pref("browser.startup.page", 0);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // settings from https://www.ghacks.net/2017/02/12/ghacks-net-firefox-user-js-config-0-11-is-out/
    /*** 0200: GEOLOCATION ***/
    user_pref("ghacks_user.js.parrot", "0200 syntax error: the parrot's definitely deceased!");
    // 0202: disable GeoIP-based search results
       // NOTE: may not be hidden if Mozilla have changed your settings due to your locale
       // https://trac.torproject.org/projects/tor/ticket/16254
    session_pref("browser.search.countryCode", "US"); // (hidden pref)
    session_pref("browser.search.region", "US"); // (hidden pref)
    // 0203: disable using OS locale, force APP locale
    session_pref("intl.locale.matchOS", false);
    // 0204: set APP local
    session_pref("general.useragent.locale", "en-US");
    // 0206: disable geographically specific results/search engines eg: "browser.search.*.US"
       // i.e ignore all of Mozilla's multiple deals with multiple engines in multiple locales
    session_pref("browser.search.geoSpecificDefaults", false);
    session_pref("browser.search.geoSpecificDefaults.url", "");
    // 0207: set language to match
       // WARNING: reset this to your default if you don't want English
    session_pref("intl.accept_languages", "en-US, en");
    // 0208: enforce US English locale regardless of the system locale
       // https://bugzilla.mozilla.org/show_bug.cgi?id=867501
    session_pref("javascript.use_us_english_locale", true); // (hidden pref)

    /*** 0300: QUIET FOX [PART 1]
     No auto-phoning home for anything. You can still do manual updates. It is still important
     to do updates for security reasons. If you don't auto update, make sure you do manually.
     There are many legitimate reasons to turn off AUTO updates, including hijacked monetized
     extensions, time constraints, legacy issues, and fear of breakage/bugs  ***/
    session_pref("ghacks_user.js.parrot", "0300 syntax error: the parrot's not pinin' for the fjords!");
    // 0303: disable search update (Options>Advanced>Update>Automatically update: search engines)
    session_pref("browser.search.update", false);
    // 0304: disable add-ons auto checking for new versions
    session_pref("extensions.update.enabled", false);
    // 0305: disable add-ons auto update
    session_pref("extensions.update.autoUpdateDefault", false);
    // 0306: disable add-on metadata updating
       // sends daily pings to Mozilla about extensions and recent startups
    session_pref("extensions.getAddons.cache.enabled", false);
    // 0309: disable sending Flash crash reports
    session_pref("dom.ipc.plugins.flash.subprocess.crashreporter.enabled", false);
    // 0310: disable sending the URL of the website where a plugin crashed
    session_pref("dom.ipc.plugins.reportCrashURL", false);
    // 0330a: disable telemetry
       // https://gecko.readthedocs.org/en/latest/toolkit/components/telemetry/telemetry/preferences.html
       // the pref (.unified) affects the behaviour of the pref (.enabled)
       // IF unified=false then .enabled controls the telemetry module
       // IF unified=true then .enabled ONLY controls whether to record extended data
       // so make sure to have both set as false
    session_pref("toolkit.telemetry.unified", false);
    session_pref("toolkit.telemetry.enabled", false);
    // 0330b: set unifiedIsOptIn to make sure telemetry respects OptIn choice and that telemetry
       // is enabled ONLY for people that opted into it, even if unified Telemetry is enabled
    session_pref("toolkit.telemetry.unifiedIsOptIn", true); // (hidden pref)
    // 0331: remove url of server telemetry pings are sent to
    session_pref("toolkit.telemetry.server", "");
    // 0332: disable archiving pings locally - irrelevant if toolkit.telemetry.unified is false
    session_pref("toolkit.telemetry.archive.enabled", false);
    // 0333a: disable health report
    session_pref("datareporting.healthreport.uploadEnabled", false);
    session_pref("datareporting.healthreport.documentServerURI", ""); // (hidden pref)
    session_pref("datareporting.healthreport.service.enabled", false); // (hidden pref)
    // 0333b: disable about:healthreport page (which connects to Mozilla for locale/css+js+json)
       // If you have disabled health reports, then this about page is useless - disable it
       // If you want to see what health data is present, then these must be set at default
    session_pref("datareporting.healthreport.about.reportUrl", "data:text/plain,");
    // 0334a: disable new data submission, master kill switch (FF41+)
       // If disabled, no policy is shown or upload takes place, ever
       // https://bugzilla.mozilla.org/show_bug.cgi?id=1195552
    session_pref("datareporting.policy.dataSubmissionEnabled", false);
    // 0335: remove a telemetry clientID
      // if you haven't got one, be proactive and set it now for future proofing
    session_pref("toolkit.telemetry.cachedClientID", "");
    // 0341: disable Mozilla permission to silently opt you into tests
    session_pref("network.allow-experiments", false);
    // 0374: disable "social" integration
       // TODO: remove above in facour of this
       // https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Social_API
    session_pref("social.whitelist", "");
    session_pref("social.toast-notifications.enabled", false);
    session_pref("social.shareDirectory", "");
    session_pref("social.remote-install.enabled", false);
    session_pref("social.directories", "");
    session_pref("social.share.activationPanelEnabled", false);
    session_pref("social.enabled", false); // (hidden pref)
    // 0375: disable "Reader View"
    session_pref("reader.parse-on-load.enabled", false);
    // 0376: disable FlyWeb, a set of APIs for advertising and discovering local-area web servers
       // https://wiki.mozilla.org/FlyWeb
       // http://www.ghacks.net/2016/07/26/firefox-flyweb/
    session_pref("dom.flyweb.enabled", false);
    // 0380: disable sync
    session_pref("services.sync.enabled", false); // (hidden pref)

    /*** 0400: QUIET FOX [PART 2]
         This section has security & tracking protection implications vs privacy concerns.
         These settings are geared up to make FF "quiet" & private. I am NOT advocating no protection.
         If you turn these off, then by all means please use something superior, such as uBlock Origin.
         <font color=#ff3333>IMPORTANT: This entire section is rather contentious. Safebrowsing is designed to protect
         users from malicious sites. Tracking protection is designed to lessen the impact of third
         parties on websites to reduce tracking and to speed up your browsing experience. These are
         both very good features provided by Mozilla. They do rely on third parties: Google for
         safebrowsing and Disconnect for tracking protection (someone has to provide the information).
         Additionally, SSL Error Reporting helps makes the internet more secure for everyone.
         If you do not understand the ramifications of disabling all of these, then it is advised that
         you enable them by commenting out the preferences and saving the changes, and then in
         about:config find each entry and right-click and reset the preference's value.</font> ***/
    session_pref("ghacks_user.js.parrot", "0400 syntax error: the parrot's passed on!");
    // 0401: DON'T disable extension blocklist, but sanitize blocklist url - SECURITY
       // It now includes updates for "revoked certificates" - security trumps privacy here
       // https://blog.mozilla.org/security/2015/03/03/revoking-intermediate-certificates-introducing-onecrl
       // https://trac.torproject.org/projects/tor/ticket/16931
    session_pref("extensions.blocklist.enabled", true);
    session_pref("extensions.blocklist.url", "https://blocklist.addons.mozilla.org/blocklist/3/%APP_ID%/%APP_VERSION%/");
    // 0402: disable/enable various Kinto blocklist updates (FF50+)
       // What is Kinto?: https://wiki.mozilla.org/Firefox/Kinto#Specifications
       // As FF transitions to Kinto, the blocklists have been broken down (more could be added). These contain
       // block entries for certs to be revoked, add-ons and plugins to be disabled, and gfx environments that
       // cause problems or crashes. Here you can remove the collection name to prevent each specific list updating
    session_pref("services.blocklist.update_enabled", true);
    session_pref("services.blocklist.signing.enforced", true);
    session_pref("services.blocklist.onecrl.collection", "certificates"); // Revoked certificates
    session_pref("services.blocklist.addons.collection", "addons");
    session_pref("services.blocklist.plugins.collection", ""); // I have no plugins
    session_pref("services.blocklist.gfx.collection", ""); // I have gfx hw acceleration disabled
    // 0410: disable safe browsing
       // I have redesigned this sub-section to differentiate between "real-time"/"user initiated"
       // data being sent to Google from all other settings such as using local blocklists/whitelists
       // and updating those lists. There SHOULD be NO privacy issues here. Even *IF* an URL was sent
       // to Google, they swear it is anonymized and only used to flag malicious sites/activity. Firefox
       // also takes measures such as striping out identifying parameters and storing safe browsing
       // cookies in a separate jar. (#Turn on browser.safebrowsing.debug to monitor this activity)
       // To use safebrowsing but not "leak" binary download info to Google, only use 0410e and 0410f
       // #Required reading: https://feeding.cloud.geek.nz/posts/how-safe-browsing-works-in-firefox/
       // https://wiki.mozilla.org/Security/Safe_Browsing
    // 0410a: disable "Block dangerous and deceptive content" This setting is under Options>Security
       // in FF47 and under this is was titled "Block reported web forgeries"
       // this covers deceptive sites such as phishing and social engineering
    session_pref("browser.safebrowsing.malware.enabled", false);
    session_pref("browser.safebrowsing.phishing.enabled", false); // (FF50+)
    // 0410b: disable "Block dangerous downloads" This setting is under Options>Security
       // in FF47 and under this was titled "Block reported attack sites"
       // this covers malware and PUPs (potentially unwanted programs)
    session_pref("browser.safebrowsing.downloads.enabled", false);
       // disable "Warn me about unwanted and uncommon software" Also under Options>Security (FF48+)
    session_pref("browser.safebrowsing.downloads.remote.block_potentially_unwanted", false);
    session_pref("browser.safebrowsing.downloads.remote.block_uncommon", false);
       // yet more prefs added (FF49+)
    session_pref("browser.safebrowsing.downloads.remote.block_dangerous", false);
    session_pref("browser.safebrowsing.downloads.remote.block_dangerous_host", false);
    // 0410c: disable Google safebrowsing downloads, updates
    session_pref("browser.safebrowsing.provider.google.updateURL", ""); // update google lists
    session_pref("browser.safebrowsing.provider.google.gethashURL", ""); // list hash check
    session_pref("browser.safebrowsing.provider.google4.updateURL", ""); // (FF50+)
    session_pref("browser.safebrowsing.provider.google4.gethashURL", ""); // (FF50+)
    // 0410d: disable mozilla safebrowsing downloads, updates
       // NOTE: These two prefs are also used for Tracking Protection (see 0420)
    session_pref("browser.safebrowsing.provider.mozilla.gethashURL", ""); // resolves hash conflicts
    session_pref("browser.safebrowsing.provider.mozilla.updateURL", ""); // update FF lists
    // 0410e: disable binaries NOT in local lists being checked by Google (real-time checking)
    session_pref("browser.safebrowsing.downloads.remote.enabled", false);
    session_pref("browser.safebrowsing.downloads.remote.url", "");
    // 0410f: disable reporting URLs
    session_pref("browser.safebrowsing.provider.google.reportURL", "");
    session_pref("browser.safebrowsing.reportMalwareMistakeURL", "");
    session_pref("browser.safebrowsing.reportPhishMistakeURL", "");
    session_pref("browser.safebrowsing.reportPhishURL", "");
    session_pref("browser.safebrowsing.provider.google4.reportURL", ""); // (FF50+)
    // 0410g: show=true or hide=false the 'ignore this warning' on Safe Browsing warnings which
       // when clicked bypasses the block for that session. This is a means for admins to enforce SB
       // https://bugzilla.mozilla.org/show_bug.cgi?id=1226490
       // tests: see APPENDIX A: TEST SITES - Section 06
       // session_pref("browser.safebrowsing.allowOverride", true);
    // 0420: disable tracking protection
       // There SHOULD be NO privacy concerns here, but you are better off using an extension such as
       // uBlock Origin which is not decided by a third party (disconnect) and is far more effective
       // (when used correctly). NOTE: There are two prefs (see 0410d) shared with Safe Browsing
       // https://wiki.mozilla.org/Security/Tracking_protection
       // https://support.mozilla.org/en-US/kb/tracking-protection-firefox
    session_pref("privacy.trackingprotection.enabled", false); // all windows pref (not just private)
    session_pref("privacy.trackingprotection.pbmode.enabled", false); // private browsing pref
    // 0421: enable more Tracking Protection choices under Options>Privacy>Use Tracking Protection
    session_pref("privacy.trackingprotection.ui.enabled", true);
    // 0430: disable SSL Error Reporting - PRIVACY
    // https://gecko.readthedocs.org/en/latest/browser/base/sslerrorreport/preferences.html
    session_pref("security.ssl.errorReporting.automatic", false);
    session_pref("security.ssl.errorReporting.enabled", false);
    session_pref("security.ssl.errorReporting.url", "");
    // 0440: disable Mozilla's blocklist for known Flash tracking/fingerprinting (48+)
       // If you don't have Flash, then you don't need this enabled
       // NOTE: if enabled, you will need to check what prefs (safebrowsing URLs etc) this uses to update
       // http://www.ghacks.net/2016/07/18/firefox-48-blocklist-against-plugin-fingerprinting/
       // https://bugzilla.mozilla.org/show_bug.cgi?id=1237198
    session_pref("browser.safebrowsing.blockedURIs.enabled", false);

    /*** 0600: BLOCK IMPLICIT OUTBOUND [not explicitly asked for - eg clicked on] ***/
    // TODO: see if this affects me, fix ones that do not apply to conkeror
    session_pref("ghacks_user.js.parrot", "0600 syntax error: the parrot's no more!");
    // 0601: disable link prefetching
       // https://developer.mozilla.org/en-US/docs/Web/HTTP/Link_prefetching_FAQ
    session_pref("network.prefetch-next", false);
    // 0602: disable dns prefetching
       // http://www.ghacks.net/2013/04/27/firefox-prefetching-what-you-need-to-know/
       // https://developer.mozilla.org/en-US/docs/Web/HTTP/Controlling_DNS_prefetching
    session_pref("network.dns.disablePrefetch", true);
    session_pref("network.dns.disablePrefetchFromHTTPS", true); // (hidden pref)
    // 0603: disable Seer/Necko
       // https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Necko
    session_pref("network.predictor.enabled", false);
    // 0603a: disable more Necko/Captive Portal
       // https://en.wikipedia.org/wiki/Captive_portal
       // https://wiki.mozilla.org/Necko/CaptivePortal
    session_pref("captivedetect.canonicalURL", "");
    session_pref("network.captive-portal-service.enabled", false); // (FF52+?)
    // 0604: disable search suggestions
    session_pref("browser.search.suggest.enabled", false);
    // 0605: disable link-mouseover opening connection to linked server
       // http://news.slashdot.org/story/15/08/14/2321202/how-to-quash-firefoxs-silent-requests
       // http://www.ghacks.net/2015/08/16/block-firefox-from-connecting-to-sites-when-you-hover-over-links
    session_pref("network.http.speculative-parallel-limit", 0);
    // 0606: disable pings (but enforce same host in case)
       // http://kb.mozillazine.org/Browser.send_pings
       // http://kb.mozillazine.org/Browser.send_pings.require_same_host
    session_pref("browser.send_pings", false);
    session_pref("browser.send_pings.require_same_host", true);
    // 0607: stop links launching Windows Store on Windows 8/8.1/10
       // http://www.ghacks.net/2016/03/25/block-firefox-chrome-windows-store/
    session_pref("network.protocol-handler.external.ms-windows-store", false);
    // 0608: disable predictor / prefetching (FF48+)
    session_pref("network.predictor.enable-prefetch", false);

    /*** 0800: LOCATION BAR / SEARCH / AUTO SUGGESTIONS / HISTORY / FORMS etc
         Not ALL of these are strictly needed, some are for the truly paranoid, but
         included for a more comprehensive list (see comments on each one) ***/
    // XXXX: changed to session_pref("layout.css.visited_links_enabled", true); because I use it
    session_pref("ghacks_user.js.parrot", "0800 syntax error: the parrot's ceased to be!");
    // 0801: disable location bar using search - PRIVACY
       // don't leak typos to a search engine, give an error message instead
    session_pref("keyword.enabled", false);
    // 0802: disable location bar domain guessing - PRIVACY/SECURITY
       // domain guessing intercepts DNS "hostname not found errors" and resends a
       // request (eg by adding www or .com). This is inconsistent use (eg FQDNs), does not work
       // via Proxy Servers (different error), is a flawed use of DNS (TLDs: why treat .com
       // as the 411 for DNS errors?), privacy issues (why connect to sites you didn't
       // intend to), can leak sensitive data (eg query strings: eg Princeton attack),
       // and is a security risk (eg common typos & malicious sites set up to exploit this)
    session_pref("browser.fixup.alternate.enabled", false);
    // 0803: disable locationbar dropdown - PRIVACY (shoulder surfers,forensics/unattended browser)
    session_pref("browser.urlbar.maxRichResults", 0);
    // 0804: display all parts of the url
       // why rely on just a visual clue - helps SECURITY
    session_pref("browser.urlbar.trimURLs", false);
    // 0805: disable URLbar autofill -  PRIVACY (shoulder surfers, forensics/unattended browser)
       // http://kb.mozillazine.org/Inline_autocomplete
    session_pref("browser.urlbar.autoFill", false);
    session_pref("browser.urlbar.autoFill.typed", false);
    // 0806: disable autocomplete - PRIVACY (shoulder surfers, forensics/unattended browser)
    session_pref("browser.urlbar.autocomplete.enabled", false);
    // 0808: disable history suggestions - PRIVACY (shoulder surfers, forensics/unattended browser)
    session_pref("browser.urlbar.suggest.history", false);
    // 0809: limit history leaks via enumeration (PER TAB: back/forward) - PRIVACY
       // This is a PER TAB session history. You still have a full history stored under all history
       // default=50, minimum=1=currentpage, 2 is the recommended minimum as some pages
       // use it as a means of referral (eg hotlinking), 4 or 6 may be more practical
    session_pref("browser.sessionhistory.max_entries", 4);
    // 0810: disable css querying page history - css history leak - PRIVACY
       // NOTE: this has NEVER been fully "resolved": in Mozilla/docs it is stated it's only in
       // 'certain circumstances', also see latest comments in the bug link
       // https://dbaron.org/mozilla/visited-privacy
       // https://bugzilla.mozilla.org/show_bug.cgi?id=147777
       // https://developer.mozilla.org/en-US/docs/Web/CSS/Privacy_and_the_:visited_selector
    // session_pref("layout.css.visited_links_enabled", false);
    session_pref("layout.css.visited_links_enabled", true);
    // 0811: disable displaying javascript in history URLs - SECURITY
    session_pref("browser.urlbar.filter.javascript", true);
    // 0812: disable search and form history
       // Under Options>Privacy> if you set Firefox to "use custom settings" there will be a
       // setting called "remember search and form history".
       // You can clear formdata on exiting Firefox (see 2803)
       // session_pref("browser.formfill.enable", false);
    // 0813: disable saving form data on secure websites - PRIVACY (shoulder surfers etc)
       // For convenience & functionality, this is best left at default true.
       // You can clear formdata on exiting Firefox (see 2803)
       // session_pref("browser.formfill.saveHttpsForms", false);
    // 0815: disable live search suggestions in the urlbar and toggle off the Opt-In prompt (FF41+)
       // Setting: Options>Privacy>Location Bar>Related searches from the default search engine
    session_pref("browser.urlbar.suggest.searches", false);
    session_pref("browser.urlbar.userMadeSearchSuggestionsChoice", true);
    // 0816: disable browsing and download history
       // Under Options>Privacy> if you set Firefox to "use custom settings" there will be a
       // setting called "remember my browsing and download history"
       // You can clear history and downloads on exiting Firefox (see 2803)
       // session_pref("places.history.enabled", false);
    // 0817: disable Jumplist (Windows7+)
    session_pref("browser.taskbar.lists.enabled", false);
    session_pref("browser.taskbar.lists.frequent.enabled", false);
    session_pref("browser.taskbar.lists.recent.enabled", false);
    session_pref("browser.taskbar.lists.tasks.enabled", false);
    // 0818: disable taskbar preview
    session_pref("browser.taskbar.previews.enable", false);
    // 0819: disable one-off searches from the addressbar (FF51+)
       // http://www.ghacks.net/2016/08/09/firefox-one-off-searches-address-bar/
    session_pref("browser.urlbar.oneOffSearches", false);
    // 0820: disable search reset (about:searchreset) (FF51+)
       // http://www.ghacks.net/2016/08/19/firefox-51-search-restore-feature/
    session_pref("browser.search.reset.enabled", false);
    session_pref("browser.search.reset.whitelist", "");

    /*** 0900: PASSWORDS ***/
    // TODO: change passwords lifetime
    session_pref("ghacks_user.js.parrot", "0900 syntax error: the parrot's expired!");
    // 0901: disable saving passwords
       // Options>Security>Logins>Remember logins for sites
       // NOTE: this does not clear any passwords already saved
       // session_pref("signon.rememberSignons", false);
    // 0902: use a master password (recommended if you save passwords)
       // There are no preferences for this. It is all handled internally.
       // https://support.mozilla.org/en-US/kb/use-master-password-protect-stored-logins
    // 0903: set how often Mozilla should ask for the master password
       // 0=the first time, 1=every time it's needed, 2=every n minutes (as per the next pref)
       // WARNING: the default is 0, author changed his settings
    session_pref("security.ask_for_password", 2);
    // 0904: how often in minutes Mozilla should ask for the master password (see pref above)
       // in minutes, default is 30
    session_pref("security.password_lifetime", 5);
    // 0905: disable auto-filling username & password form fields - SECURITY
       // can leak in cross-site forms AND be spoofed
       // http://kb.mozillazine.org/Signon.autofillForms
       // password will still be auto-filled after a user name is manually entered
    session_pref("signon.autofillForms", false);
    // 0906: ignore websites' autocomplete="off" (FF30+)
    session_pref("signon.storeWhenAutocompleteOff", true);
    // 0907: force warnings for logins on non-secure (non HTTPS) pages
       // https://bugzilla.mozilla.org/show_bug.cgi?id=1217156
    session_pref("security.insecure_password.ui.enabled", true);
    // 0908: When attempting to fix an entered URL, do not fix an entered password along with it
       // i.e do not turn ~http://user:password@foo into ~http://user:password@(prefix)foo(suffix)
       // but instead ~http://user@(prefix)foo(suffix))
    session_pref("browser.fixup.hide_user_pass", true);
    // 0909: disabling for now (FF51+)
    session_pref("signon.formlessCapture.enabled", false);

    /*** 1000: CACHE ***/
    session_pref("ghacks_user.js.parrot", "1000 syntax error: the parrot's gone to meet 'is maker!");
    // 1001: disable disk cache
    session_pref("browser.cache.disk.enable", false);
    session_pref("browser.cache.disk.capacity", 0);
    session_pref("browser.cache.disk.smart_size.enabled", false);
    session_pref("browser.cache.disk.smart_size.first_run", false);
    // 1002: disable disk caching of SSL pages
       // http://kb.mozillazine.org/Browser.cache.disk_cache_ssl
    session_pref("browser.cache.disk_cache_ssl", false);
    // 1003: disable memory cache as well IF you're REALLY paranoid
       // I haven't tried it, but I'm sure you'll take a performance/traffic hit
       // session_pref("browser.cache.memory.enable", false);
    // 1004: disable offline cache
    session_pref("browser.cache.offline.enable", false);
    // 1005: disable storing extra session data 0=all 1=http-only 2=none
       // extra session data contains contents of forms, scrollbar positions, cookies and POST data
    session_pref("browser.sessionstore.privacy_level", 2);
    // 1006: disable pages being stored in memory. This is not the same as memory cache.
       // Visited pages are stored in memory in such a way that they don't have to be
       // re-parsed. This improves performance when pressing back/forward.
       // For the sake of completeness, this option is listed for the truly paranoid.
       // 0=none, -1=auto (that's minus 1), or any other positive integer
       // http://kb.mozillazine.org/Browser.sessionhistory.max_total_viewers
       // session_pref("browser.sessionhistory.max_total_viewers", 0);
    // 1007: disable the Session Restore service completely
       // WARNING: This also disables the "Recently Closed Tabs" feature
       // It does not affect "Recently Closed Windows" or any history.
    session_pref("browser.sessionstore.max_tabs_undo", 0);
    session_pref("browser.sessionstore.max_windows_undo", 0);
    // 1008: IF you use session restore (see 1007 above), increasing the minimal interval between
       // two session save operations can help on older machines and some websites.
       // Default is 15000 (15 secs). Try 30000 (30sec), 60000 (1min) etc - your choice.
       // WARNING: This can also affect entries in the "Recently Closed Tabs" feature:
       // i.e the longer the interval the more chance a quick tab open/close won't be captured
       // this longer interval *MAY* affect history but I cannot replicate any history not recorded
       // session_pref("browser.sessionstore.interval", 30000);
    // 1009: DNS cache and expiration time (default 400 and 60 - same as TBB)
       // session_pref("network.dnsCacheEntries", 400);
       // session_pref("network.dnsCacheExpiration", 60);
    // 1010: disable randomized FF HTTP cache decay experiments
       // https://trac.torproject.org/projects/tor/ticket/13575
    session_pref("browser.cache.frecency_experiment", -1);
    // 1011: disable permissions manager from writing to disk (requires restart)
      // https://bugzilla.mozilla.org/show_bug.cgi?id=967812
      // session_pref("permissions.memory_only", true); // (hidden pref)
    // 1012: disable resuming session from crash
    session_pref("browser.sessionstore.resume_from_crash", false);

    /*** 1200: SSL / OCSP / CERTS / ENCRYPTION / HSTS/HPKP/HTTPS
         Note that your cipher and other settings can be used server side as a fingerprint attack vector:
         see https://www.securityartwork.es/2017/02/02/tls-client-fingerprinting-with-bro/ . You can either
         strengthen your encryption/cipher suite and protocols (security) or keep them at default and let
         Mozilla handle them (dragging their feet for fear of breaking legacy sites) ***/
    session_pref("ghacks_user.js.parrot", "1200 syntax error: the parrot's a stiff!");
    // 1201: block rc4 fallback (default is now false as of at least FF45)
    session_pref("security.tls.unrestricted_rc4_fallback", false);
    // 1203: enable OCSP stapling
       // https://blog.mozilla.org/security/2013/07/29/ocsp-stapling-in-firefox/
    session_pref("security.ssl.enable_ocsp_stapling", true);
    // 1204: reject communication with servers using old SSL/TLS - vulnerable to a MiTM attack
       // https://wiki.mozilla.org/Security:Renegotiation
       // WARNING: tested Jan 2017 - still breaks too many sites
       // session_pref("security.ssl.require_safe_negotiation", true);
    // 1205: display warning (red padlock) for "broken security"
       // https://wiki.mozilla.org/Security:Renegotiation
    session_pref("security.ssl.treat_unsafe_negotiation_as_broken", true);
    // 1206: require certificate revocation check through OCSP protocol
       // This leaks information about the sites you visit to the CA (cert authority)
       // It's a trade-off between security (checking) and privacy (leaking info to the CA)
       // WARNING: Since FF44 the default is false. If set to true, this may/will cause some
       // site breakage. Some users have previously mentioned issues with youtube, microsoft etc
       // session_pref("security.OCSP.require", true);
    // 1207: query OCSP responder servers to confirm current validity of certificates (default=1)
       // 0=disable, 1=validate only certificates that specify an OCSP service URL
       // 2=enable and use values in security.OCSP.URL and security.OCSP.signing
    session_pref("security.OCSP.enabled", 1);
    // 1208: enforce strict pinning
       // https://trac.torproject.org/projects/tor/ticket/16206
       // PKP (public key pinning) 0-disabled 1=allow user MiTM (such as your antivirus), 2=strict
       // WARNING: If you rely on an AV (antivirus) to protect your web browsing
       // by inspecting ALL your web traffic, then leave at current default =1
    session_pref("security.cert_pinning.enforcement_level", 2);
    // 1209: control TLS versions with min and max
       // 1=min version of TLS 1.0, 2-min version of TLS 1.1, 3=min version of TLS 1.2 etc
       // WARNING: FF/chrome currently allow TLS 1.0 by default, so this is your call.
       // http://kb.mozillazine.org/Security.tls.version.*
       // https://www.ssl.com/how-to/turn-off-ssl-3-0-and-tls-1-0-in-your-browser/
       // session_pref("security.tls.version.min", 2);
       // session_pref("security.tls.version.fallback-limit", 3);
       // session_pref("security.tls.version.max", 4); // allow up to and including TLS 1.3
    // 1210: disable 1024-DH Encryption
       // https://www.eff.org/deeplinks/2015/10/how-to-protect-yourself-from-nsa-attacks-1024-bit-DH
       // WARNING: may break obscure sites, but not major sites, which should support ECDH over DHE
    session_pref("security.ssl3.dhe_rsa_aes_128_sha", false);
    session_pref("security.ssl3.dhe_rsa_aes_256_sha", false);
    // 1211: disable or limit SHA-1
       // 0 = all SHA1 certs are allowed
       // 1 = all SHA1 certs are blocked (including perfectly valid ones from 2015 and earlier)
       // 2 = deprecated option that now maps to 1
       // 3 = only allowed for locally-added roots (e.g. anti-virus)
       // 4 = only allowed for locally-added roots or for certs in 2015 and earlier
       // WARNING: when disabled, some man-in-the-middle devices (eg security scanners and antivirus
       // products, are failing to connect to HTTPS sites. SHA-1 will eventually become obsolete.
       // https://blog.mozilla.org/security/2016/10/18/phasing-out-sha-1-on-the-public-web/
       // https://github.com/pyllyukko/user.js/issues/194#issuecomment-256509998
    session_pref("security.pki.sha1_enforcement_level", 1);
    // 1212: disable SSL session tracking (36+)
       // SSL session IDs speed up HTTPS connections (no need to renegotiate) and last for 48hrs.
       // Since the ID is unique, web servers can (and do) use it for tracking. If set to true,
       // this disables sending SSL3 Session IDs and TLS Session Tickets to prevent session tracking
       // WARNING: This will slow down TLS connections (personally I don't notice it at all)
       // https://tools.ietf.org/html/rfc5077
       // https://bugzilla.mozilla.org/show_bug.cgi?id=967977
    session_pref("security.ssl.disable_session_identifiers", true); // (hidden pref)
    // 1213: disable 3DES (effective key size < 128)
       // https://en.wikipedia.org/wiki/3des#Security
       // http://en.citizendium.org/wiki/Meet-in-the-middle_attack
       // http://www-archive.mozilla.org/projects/security/pki/nss/ssl/fips-ssl-ciphersuites.html
    session_pref("security.ssl3.rsa_des_ede3_sha", false);
    // 1214: disable 128 bits
    session_pref("security.ssl3.ecdhe_ecdsa_aes_128_sha", false);
    session_pref("security.ssl3.ecdhe_rsa_aes_128_sha", false);
    // 1215: disable Microsoft Family Safety cert (Windows 8.1)
       // 0: disable detecting Family Safety mode and importing the root
       // 1: only attempt to detect Family Safety mode (don't import the root)
       // 2: detect Family Safety mode and import the root
    session_pref("security.family_safety.mode", 0);
    // 1216: disable insecure active content on https pages - mixed content
    session_pref("security.mixed_content.block_active_content", true);
    // 1217: disable insecure passive content (such as images) on https pages - mixed context
       // current default=false, leave it this way as too many sites break visually
       // session_pref("security.mixed_content.block_display_content", true);
    // 1218: disable HSTS Priming (FF51+)
       // RISKS: formerly blocked mixed-content may load, may cause noticeable delays eg requests
       //        time out, requests may not be handled well by servers, possible fingerprinting
       // https://bugzilla.mozilla.org/show_bug.cgi?id=1246540#c145
    session_pref("security.mixed_content.send_hsts_priming", false);
    session_pref("security.mixed_content.use_hsts", false);
    // 1219: disable HSTS preload list
       // recommended enabled, unless you fully understand the risks and trade-offs
       // session_pref("network.stricttransportsecurity.preloadlist", false);
    // 1220: disable intermediate certificate caching (fingerprinting attack vector)
       // NOTE: This affects login/cert/key dbs. AFAIK the only effect is all active logins start anew
       // per session. This may be better handled under FPI (ticket 1323644, part of Tor Uplift)
       // https://bugzilla.mozilla.org/show_bug.cgi?id=1334485 // related bug
       // https://bugzilla.mozilla.org/show_bug.cgi?id=1216882 // related bug (see comment 9)
       // session_pref("security.nocertdb", true); // (hidden pref)

    /*** 2000: MEDIA / CAMERA / MIKE ***/
    session_pref("ghacks_user.js.parrot", "2000 syntax error: the parrot's snuffed it!");
    // 2001: disable WebRTC
       // https://www.privacytools.io/#webrtc
    session_pref("media.peerconnection.enabled", false);
    session_pref("media.peerconnection.use_document_iceservers", false);
    session_pref("media.peerconnection.video.enabled", false);
    session_pref("media.peerconnection.identity.enabled", false);
    session_pref("media.peerconnection.identity.timeout", 1);
    session_pref("media.peerconnection.turn.disable", true);
       // disable video capability for WebRTC
    session_pref("media.navigator.video.enabled", false);
    // 2001a: pref which improves the WebRTC IP Leak issue, as opposed to completely
       // disabling WebRTC. You still need to enable WebRTC for this to be applicable (FF42+)
       // https://wiki.mozilla.org/Media/WebRTC/Privacy
    session_pref("media.peerconnection.ice.default_address_only", true); // (FF41-FF50)
    session_pref("media.peerconnection.ice.no_host", true); // (FF51+)
    // 2010: disable WebGL, force bare minimum feature set if used & disable WebGL extensions
       // http://www.contextis.com/resources/blog/webgl-new-dimension-browser-exploitation/
       // https://security.stackexchange.com/questions/13799/is-webgl-a-security-concern
    session_pref("webgl.disabled", true);
    session_pref("pdfjs.enableWebGL", false);
    session_pref("webgl.min_capability_mode", true);
    session_pref("webgl.disable-extensions", true);
    session_pref("webgl.disable-fail-if-major-performance-caveat", true);
    // 2011: don't make WebGL debug info available to websites
       // https://bugzilla.mozilla.org/show_bug.cgi?id=1171228
       // https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_debug_renderer_info
    session_pref("webgl.enable-debug-renderer-info", false);
    // 2012: two more webgl preferences (FF51+)
    session_pref("webgl.dxgl.enabled", false);
    session_pref("webgl.enable-webgl2", false);
    // 2021: disable speech recognition
    session_pref("media.webspeech.recognition.enable", false);
    session_pref("media.webspeech.synth.enabled", false);
    // 2022: disable screensharing
    session_pref("media.getusermedia.screensharing.enabled", false);
    session_pref("media.getusermedia.screensharing.allowed_domains", "");
    session_pref("media.getusermedia.screensharing.allow_on_old_platforms", false);
    session_pref("media.getusermedia.browser.enabled", false);
    session_pref("media.getusermedia.audiocapture.enabled", false);
    // 2023: disable camera stuff
    session_pref("camera.control.face_detection.enabled", false);
    // 2024: enable/disable MSE (Media Source Extensions)
       // http://www.ghacks.net/2014/05/10/enable-media-source-extensions-firefox/
    session_pref("media.mediasource.enabled", true);
    session_pref("media.mediasource.mp4.enabled", true);
    session_pref("media.mediasource.webm.audio.enabled", true);
    session_pref("media.mediasource.webm.enabled", true);
    // 2025: enable/disable various media types - end user personal choice
       // WARNING: this is the author's settings, choose your own
    session_pref("media.mp4.enabled", true);
    session_pref("media.flac.enabled", true); // (FF51+)
    session_pref("media.ogg.enabled", false);
    session_pref("media.ogg.flac.enabled", false); // (FF51+)
    session_pref("media.opus.enabled", false);
    session_pref("media.raw.enabled", false);
    session_pref("media.wave.enabled", false);
    session_pref("media.webm.enabled", true);
    session_pref("media.wmf.enabled", true); // https://www.youtube.com/html5 - for the two H.264 entries
    // 2026: disable canvas capture stream
       // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/captureStream
    session_pref("canvas.capturestream.enabled", false);
    // 2027: disable camera image capture
       // https://trac.torproject.org/projects/tor/ticket/16339
    session_pref("dom.imagecapture.enabled", false);
    // 2028: disable offscreen canvas
       // https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
    session_pref("gfx.offscreencanvas.enabled", false);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /*** 2500: HARDWARE FINGERPRINTING ***/
    session_pref("ghacks_user.js.parrot", "2500 syntax error: the parrot's shuffled off 'is mortal coil!");
    // 2501: disable gamepad API - USB device ID enumeration
       // https://trac.torproject.org/projects/tor/ticket/13023
    session_pref("dom.gamepad.enabled", false);
    // 2502: disable Battery Status API. Initially a Linux issue (high precision readout) that is now fixed.
       // However, it is still another metric for fingerprinting, used to raise entropy.
       // eg: do you have a battery or not, current charging status, charge level, times remaining etc
       // http://techcrunch.com/2015/08/04/battery-attributes-can-be-used-to-track-web-users/
       // https://bugzilla.mozilla.org/show_bug.cgi?id=1124127
       // https://www.w3.org/TR/battery-status/
       // https://www.theguardian.com/technology/2016/aug/02/battery-status-indicators-tracking-online
       // NOTE: From FF52+ Battery Status API is only available in chrome/privileged code.
       // https://bugzilla.mozilla.org/show_bug.cgi?id=1313580
    session_pref("dom.battery.enabled", false);
    // 2503: disable giving away network info
       // eg bluetooth, cellular, ethernet, wifi, wimax, other, mixed, unknown, none
       // https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API
       // https://wicg.github.io/netinfo/
       // https://bugzilla.mozilla.org/show_bug.cgi?id=960426
    session_pref("dom.netinfo.enabled", false);
    // 2504: disable virtual reality devices
       // https://developer.mozilla.org/en-US/docs/Web/API/WebVR_API
    session_pref("dom.vr.enabled", false);
    session_pref("dom.vr.oculus.enabled", false);
    session_pref("dom.vr.osvr.enabled", false); // (FF49+)
    session_pref("dom.vr.openvr.enabled", false); // (FF51+)
    // 2505: disable media device enumeration (FF29+)
       // NOTE: media.peerconnection.enabled should also be set to false (see 2001)
       // https://wiki.mozilla.org/Media/getUserMedia
       // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices
    session_pref("media.navigator.enabled", false);
    // 2506: disable video statistics - JS performance fingerprinting
      // https://trac.torproject.org/projects/tor/ticket/15757
    session_pref("media.video_stats.enabled", false);
    // 2507: disable keyboard fingerprinting (FF38+) (physical keyboards)
       // The Keyboard API allows tracking the "read parameter" of pressed keys in forms on
       // web pages. These parameters vary between types of keyboard layouts such as QWERTY,
       // AZERTY, Dvorak, and between various languages, eg German vs English.
       // WARNING: Don't use if Android + physical keyboard
       // UPDATE: This MAY be incorporated better into the Tor Uplift project (see 2699)
       // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
       // https://www.privacy-handbuch.de/handbuch_21v.htm
    session_pref("dom.keyboardevent.code.enabled", false);
    session_pref("dom.beforeAfterKeyboardEvent.enabled", false);
    session_pref("dom.keyboardevent.dispatch_during_composition", false);
    // 2508: disable graphics fingerprinting (the loss of hardware acceleration is negligible)
       // These prefs are under Options>Advanced>General>Use hardware acceleration when available
       // NOTE: changing this option changes BOTH these preferences
       // https://wiki.mozilla.org/Platform/GFX/HardwareAcceleration
       // WARNING: This changes text rendering (fonts will look different)
       //          If you watch a lot of video, this will impact performance
    session_pref("gfx.direct2d.disabled", true);
    session_pref("layers.acceleration.disabled", true);
    // 2509: disable touch events
       // https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
       // https://trac.torproject.org/projects/tor/ticket/10286
       // fingerprinting attack vector - leaks screen res & actual screen coordinates
       // WARNING: If you use touch eg Win8/10 Metro/Smartphone reset this to default
    session_pref("dom.w3c_touch_events.enabled", 0);
    // 2510: disable Web Audio API (FF51+)
       // https://bugzilla.mozilla.org/show_bug.cgi?id=1288359
    session_pref("dom.webaudio.enabled", false);
    // 2511: disable MediaDevices change detection (FF51+) (enabled by default starting FF52+)
       // https://developer.mozilla.org/en-US/docs/Web/Events/devicechange
       // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/ondevicechange
    session_pref("media.ondevicechange.enabled", false);

    /*** 2600: MISC - LEAKS / FINGERPRINTING / PRIVACY / SECURITY ***/
    session_pref("ghacks_user.js.parrot", "2600 syntax error: the parrot's run down the curtain!");
    // 2601: disable sending additional analytics to web servers
       // https://developer.mozilla.org/en-US/docs/Web/API/navigator.sendBeacon
    session_pref("beacon.enabled", false);
    // 2602: CIS 2.3.2 disable downloading on desktop
    session_pref("browser.download.folderList", 2);
    // 2603: always ask the user where to download - enforce user interaction for security
    session_pref("browser.download.useDownloadDir", false);
    // 2604: https://bugzil.la/238789#c19
    session_pref("browser.helperApps.deleteTempFileOnExit", true);
    // 2605: don't integrate activity into windows recent documents
    session_pref("browser.download.manager.addToRecentDocs", false);
    // 2606: disable hiding mime types (Options>Applications) not associated with a plugin
    session_pref("browser.download.hide_plugins_without_extensions", false);
    // 2607: disable page thumbnail collection
       // look in profile/thumbnails directory - you may want to clean that out
    session_pref("browser.pagethumbnails.capturing_disabled", true); // (hidden pref)
    // 2608: disable JAR from opening Unsafe File Types
    session_pref("network.jar.open-unsafe-types", false);
    // 2611: disable WebIDE to prevent remote debugging and add-on downloads
       // https://trac.torproject.org/projects/tor/ticket/16222
    session_pref("devtools.webide.autoinstallADBHelper", false);
    session_pref("devtools.webide.autoinstallFxdtAdapters", false);
    session_pref("devtools.debugger.remote-enabled", false);
    session_pref("devtools.webide.enabled", false);
    // 2612: disable SimpleServiceDiscovery - which can bypass proxy settings - eg Roku
       // https://trac.torproject.org/projects/tor/ticket/16222
    session_pref("browser.casting.enabled", false);
    session_pref("gfx.layerscope.enabled", false);
    // 2613: disable device sensor API - fingerprinting vector
       // https://trac.torproject.org/projects/tor/ticket/15758
    session_pref("device.sensors.enabled", false);
    // 2614: disable SPDY as it can contain identifiers
       // https://www.torproject.org/projects/torbrowser/design/#identifier-linkability (no. 10)
    session_pref("network.http.spdy.enabled", false);
    session_pref("network.http.spdy.enabled.deps", false);
    // 2615: disable http2 for now as well
    session_pref("network.http.spdy.enabled.http2", false);
    // 2617: disable pdf.js as an option to preview PDFs within Firefox
       // see mime-types under Options>Applications) - EXPLOIT risk
       // Enabling this (set to true) will change your option most likely to "Ask" or "Open with
       // some external pdf reader". This does NOT necessarily prevent pdf.js being used via
       // other means, it only removes the option. I think this should be left at default (false).
       // 1. It won't stop JS bypassing it. 2. Depending on external pdf viewers there is just as
       // much risk or more (acrobat). 3. Mozilla are very quick to patch these sorts of exploits,
       // they treat them as severe/critical and 4. for convenience
    session_pref("pdfjs.disabled", false);
    // 2618: when using SOCKS have the proxy server do the DNS lookup - dns leak issue
       // http://kb.mozillazine.org/Network.proxy.socks_remote_dns
       // https://trac.torproject.org/projects/tor/wiki/doc/TorifyHOWTO/WebBrowsers
       // eg in TOR, this stops your local DNS server from knowing your Tor destination
       // as a remote Tor node will handle the DNS request
    session_pref("network.proxy.socks_remote_dns", true);
    // 2619: limit HTTP redirects (this does not control redirects with HTML meta tags or JS)
       // WARNING: a low setting of 5 or under will probably break some sites (eg gmail logins)
       // To control HTML Meta tag and JS redirects, use an add-on (eg NoRedirect). Default is 20
    session_pref("network.http.redirection-limit", 10);
    // 2620: disable middle mouse click opening links from clipboard
       // https://trac.torproject.org/projects/tor/ticket/10089
       // http://kb.mozillazine.org/Middlemouse.contentLoadURL
    session_pref("middlemouse.contentLoadURL", false);
    // 2621: disable IPv6 (included for knowledge ONLY - not recommended)
       // This is all about covert channels such as MAC addresses being included/abused in the
       // IPv6 protocol for tracking. If you want to mask your IP address, this is not the way
       // to do it. It's 2016, IPv6 is here. Here are some old links
       // 2010: https://www.christopher-parsons.com/ipv6-and-the-future-of-privacy/
       // 2011: https://iapp.org/news/a/2011-09-09-facing-the-privacy-implications-of-ipv6
       // 2012: http://www.zdnet.com/article/security-versus-privacy-with-ipv6-deployment/
       // NOTE: It is a myth that disabling IPv6 will speed up your internet connection
       // http://www.howtogeek.com/195062/no-disabling-ipv6-probably-wont-speed-up-your-internet-connection
       // session_pref("network.dns.disableIPv6", true);
       // session_pref("network.http.fast-fallback-to-IPv4", true);
    // 2622: ensure you have a security delay when installing add-ons (milliseconds)
       // default=1000, This also covers the delay in "Save" on downloading files.
       // http://kb.mozillazine.org/Disable_extension_install_delay_-_Firefox
       // http://www.squarefree.com/2004/07/01/race-conditions-in-security-dialogs/
    session_pref("security.dialog_enable_delay", 1000);
    // 2623: ensure Strict File Origin Policy on local files
       // The default is true. Included for completeness
       // http://kb.mozillazine.org/Security.fileuri.strict_origin_policy
    session_pref("security.fileuri.strict_origin_policy", true);
    // 2624: enforce Subresource Integrity (SRI) (FF43+)
       // The default is true. Included for completeness
       // https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity
       // https://wiki.mozilla.org/Security/Subresource_Integrity
    session_pref("security.sri.enable", true);
    // 2625: Applications [non Tor protocol] SHOULD generate an error
       // upon the use of .onion and SHOULD NOT perform a DNS lookup.
       // https://bugzilla.mozilla.org/show_bug.cgi?id=1228457
    session_pref("network.dns.blockDotOnion", true);
    // 2626: strip optional user agent token, default is false, included for completeness
       // https://developer.mozilla.org/en-US/docs/Web/HTTP/Gecko_user_agent_string_reference
    session_pref("general.useragent.compatMode.firefox", false);
    // 2627: Spoof default UA & relevant (navigator) parts (also see 0204 for UA language)
       // NOTE: may be better handled by an extension (eg whitelisitng), try not to clash with it
       // NOTE: this is NOT a complete solution (feature detection, some navigator objects leak, resource URI etc)
       // AIM: match latest TBB settings: Windows, ESR, OS etc
       // WARNING: If you do not understand fingerprinting then don't use this section
       // test: http://browserspy.dk/browser.php
       //       http://browserspy.dk/showprop.php (for buildID)
       //       http://browserspy.dk/useragent.php
       // ==start==
       // A: navigator.userAgent leaks in JS, setting this also seems to break UA extension whitelisting
       // session_pref("general.useragent.override", "Mozilla/5.0 (Windows NT 6.1; rv:45.0) Gecko/20100101 Firefox/45.0"); // (hidden pref)
       // B: navigator.buildID (see gecko.buildID in about:config) reveals build time
       // down to the second which defeats user agent spoofing and can compromise OS etc
       // https://bugzilla.mozilla.org/show_bug.cgi?id=583181
    session_pref("general.buildID.override", "20100101"); // (hidden pref)
       // C: navigator.appName
    session_pref("general.appname.override", "Netscape"); // (hidden pref)
       // D: navigator.appVersion
    session_pref("general.appversion.override", "5.0 (Windows)"); // (hidden pref)
       // E: navigator.platform leaks in JS
    session_pref("general.platform.override", "Win32"); // (hidden pref)
       // F: navigator.oscpu
    session_pref("general.oscpu.override", "Windows NT 6.1"); // (hidden pref)
    // 2628: disable UITour backend so there is no chance that a remote page can use it
    session_pref("browser.uitour.enabled", false);
    session_pref("browser.uitour.url", "");
    // 2629: disable remote JAR files being opened, regardless of content type
       // https://bugzilla.mozilla.org/show_bug.cgi?id=1215235
    session_pref("network.jar.block-remote-files", true);
    // 2650: start the browser in e10s mode (48+)
       // After restarting the browser, you can check whether it's enabled by visiting
       // about:support and checking that "Multiprocess Windows" = 1
       // use force-enable and extensions.e10sblocksenabling if you have add-ons
       // session_pref("browser.tabs.remote.autostart", true);
       // session_pref("browser.tabs.remote.autostart.2", true); // (FF49+)
       // session_pref("browser.tabs.remote.force-enable", true); // (hidden pref)
       // session_pref("extensions.e10sBlocksEnabling", false);
    // 2651: control e10s number of container processes
       // http://www.ghacks.net/2016/02/15/change-how-many-processes-multi-process-firefox-uses/
       // https://bugzilla.mozilla.org/show_bug.cgi?id=1207306
       // session_pref("dom.ipc.processCount", 4);
    // 2652: enable console shim warnings for extensions that don't have the flag
       // 'multiprocessCompatible' set to true
    session_pref("dom.ipc.shims.enabledWarnings", true);
    // 2660: enforce separate content process for file://URLs (FF53+?)
       // https://bugzilla.mozilla.org/show_bug.cgi?id=1147911
       // http://www.ghacks.net/2016/11/27/firefox-53-exclusive-content-process-for-local-files/
    session_pref("browser.tabs.remote.separateFileUriProcess", true);
    // 2662: disable "open with" in download dialog (FF50+)
       // This is very useful to enable when the browser is sandboxed (e.g. via AppArmor)
       // in such a way that it is forbidden to run external applications.
       // WARNING: This may interfere with some users' workflow or methods
       // https://bugzilla.mozilla.org/show_bug.cgi?id=1281959
    session_pref("browser.download.forbid_open_with", true);
    // 2663: disable MathML (FF51+)
       // https://bugzilla.mozilla.org/show_bug.cgi?id=1173199
       // test: http://browserspy.dk/mathml.php
    session_pref("mathml.disabled", true);
    // 2664: disable DeviceStorage API
       // https://wiki.mozilla.org/WebAPI/DeviceStorageAPI
    session_pref("device.storage.enabled", false);
    // 2665: sanitize webchannel whitelist
    session_pref("webchannel.allowObject.urlWhitelist", "");
    // 2666: disable HTTP Alternative Services
       // http://www.ghacks.net/2015/08/18/a-comprehensive-list-of-firefox-privacy-and-security-settings/#comment-3970881
    session_pref("network.http.altsvc.enabled", false);
    session_pref("network.http.altsvc.oe", false);
    // 2667: disable various developer tools in browser context
       // Devtools>Advanced Settings>Enable browser chrome and add-on debugging toolboxes
       // http://github.com/pyllyukko/user.js/issues/179#issuecomment-246468676
    session_pref("devtools.chrome.enabled", false);
    // 2668: lock down allowed extension directories
       // https://mike.kaply.com/2012/02/21/understanding-add-on-scopes/
       // archived: http://archive.is/DYjAM
    session_pref("extensions.enabledScopes", 1); // (hidden pref)
    session_pref("extensions.autoDisableScopes", 15);
    // 2669: strip paths when sending URLs to PAC scripts (FF51+)
       // CVE-2017-5384: Information disclosure via Proxy Auto-Config (PAC)
       // https://bugzilla.mozilla.org/show_bug.cgi?id=1255474
    session_pref("network.proxy.autoconfig_url.include_path", false);
    // 2670: close bypassing of CSP via image mime types (FF51+)
       // https://bugzilla.mozilla.org/show_bug.cgi?id=1288361
    session_pref("security.block_script_with_wrong_mime", true);
    // 2671: disable SVG (FF53+)
       // https://bugzilla.mozilla.org/show_bug.cgi?id=1216893
    session_pref("svg.disabled", true);

    /*** 2800: SHUTDOWN ***/
    session_pref("ghacks_user.js.parrot", "2800 syntax error: the parrot's bleedin' demised!");
    // 2802: enable FF to clear stuff on close
       // This setting is under Options>Privacy>Clear history when Firefox closes
    session_pref("privacy.sanitize.sanitizeOnShutdown", true);
    // 2803: what to clear on shutdown
       // These settings are under Options>Privacy>Clear history when Firefox closes>Settings
       // These are the settings of the author of this user.js, chose your own
    session_pref("privacy.clearOnShutdown.cache", true);
    session_pref("privacy.clearOnShutdown.cookies", false);
    session_pref("privacy.clearOnShutdown.downloads", true);
    session_pref("privacy.clearOnShutdown.formdata", true);
    session_pref("privacy.clearOnShutdown.history", true);
    session_pref("privacy.clearOnShutdown.offlineApps", true);
    session_pref("privacy.clearOnShutdown.sessions", false); // active logins
    session_pref("privacy.clearOnShutdown.siteSettings", false);
    // 2803a: include all open windows/tabs when you shutdown
       // session_pref("privacy.clearOnShutdown.openWindows", true);
    // 2804: (to match above) - auto selection of items to delete with Ctrl-Shift-Del
    session_pref("privacy.cpd.cache", true);
    session_pref("privacy.cpd.cookies", false);
    session_pref("privacy.cpd.downloads", true);
    session_pref("privacy.cpd.formdata", true);
    session_pref("privacy.cpd.history", true);
    session_pref("privacy.cpd.offlineApps", true);
    session_pref("privacy.cpd.passwords", false);
    session_pref("privacy.cpd.sessions", false);
    session_pref("privacy.cpd.siteSettings", false);
    // 2804a: include all open windows/tabs when you run clear recent history
       // session_pref("privacy.cpd.openWindows", true);
    // 2805: reset default 'Time range to clear' for 'clear recent history' (see 2804 above)
       // Firefox remembers your last choice. This will reset the value when you start FF.
       // 0=everything 1=last hour, 2=last 2 hours, 3=last 4 hours, 4=today
    session_pref("privacy.sanitize.timeSpan", 0);

    // END: internal custom pref to test for syntax errors
    user_pref("ghacks_user.js.parrot", "No no he's not dead, he's, he's restin'! Remarkable bird, the Norwegian Blue");
}
var endTime = new Date();
var timeDiff = endTime - startTime;
session_pref("ghacks_user.js.thetime",String(timeDiff) + " ms");
