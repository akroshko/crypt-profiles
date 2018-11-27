// Modified from https://www.ghacks.net/download/130328/ to include only conkeror/palemoon specific settings.

// No license found on original, but license of this is same as
// original plus copyright Andrew Kroshko 2018.

var g_security_privacy_prefs_successful=false;

////////////////////////////////////////////////////////////////////////////////
// security stuff, taken from privacy prefs in ghacks
// 0303: disable search update (Options>Advanced>Update>Automatically update: search engines)
session_pref("browser.search.update", false);
// 0304: disable add-ons auto checking for new versions
session_pref("extensions.update.enabled", false);
// 0305: disable add-ons auto update
session_pref("extensions.update.autoUpdateDefault", false);
// 0306: disable add-on metadata updating
// sends daily pings to Mozilla about extensions and recent startups
session_pref("extensions.getAddons.cache.enabled", false);
// 0330a: disable telemetry
// https://gecko.readthedocs.org/en/latest/toolkit/components/telemetry/telemetry/preferences.html
// the pref (.unified) affects the behaviour of the pref (.enabled)
// IF unified=false then .enabled controls the telemetry module
// IF unified=true then .enabled ONLY controls whether to record extended data
// so make sure to have both set as false
// TODO: this does not seem to be in conkeror
session_pref("toolkit.telemetry.unified", false);
session_pref("toolkit.telemetry.enabled", false);
// 0330b: set unifiedIsOptIn to make sure telemetry respects OptIn choice and that telemetry
   // is enabled ONLY for people that opted into it, even if unified Telemetry is enabled
session_pref("toolkit.telemetry.unifiedIsOptIn", true); // (hidden pref)
// 0331: remove url of server telemetry pings are sent to
session_pref("toolkit.telemetry.server", "");
// 0341: disable Mozilla permission to silently opt you into tests
session_pref("network.allow-experiments", false);
// 0374: disable "social" integration
// TODO: remove above in favour of this
// https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Social_API
session_pref("social.enabled", false); // (hidden pref)
session_pref("social.whitelist", "");
session_pref("social.remote-install.enabled", false);
session_pref("social.toast-notifications.enabled", false);
session_pref("social.directories", "");

// TODO: do these at some point, need to figure out if I have a blocklist for palemoon/conkeror
// 0401: DON'T disable extension blocklist, but sanitize blocklist url - SECURITY
   // It now includes updates for "revoked certificates" - security trumps privacy here
   // https://blog.mozilla.org/security/2015/03/03/revoking-intermediate-certificates-introducing-onecrl
   // https://trac.torproject.org/projects/tor/ticket/16931
session_pref("extensions.blocklist.enabled", true);
// session_pref("extensions.blocklist.url", "https://blocklist.addons.mozilla.org/blocklist/3/%APP_ID%/%APP_VERSION%/");
// 0402: disable/enable various Kinto blocklist updates (FF50+)
   // What is Kinto?: https://wiki.mozilla.org/Firefox/Kinto#Specifications
   // As FF transitions to Kinto, the blocklists have been broken down (more could be added). These contain
   // block entries for certs to be revoked, add-ons and plugins to be disabled, and gfx environments that
   // cause problems or crashes. Here you can remove the collection name to prevent each specific list updating
// session_pref("services.blocklist.update_enabled", true);
// session_pref("services.blocklist.signing.enforced", true);
// session_pref("services.blocklist.onecrl.collection", "certificates"); // Revoked certificates
// session_pref("services.blocklist.addons.collection", "addons");
// session_pref("services.blocklist.plugins.collection", ""); // I have no plugins
// session_pref("services.blocklist.gfx.collection", ""); // I have gfx hw acceleration disabled

session_pref("privacy.trackingprotection.enabled", false); // all windows pref (not just private)
// 0601: disable link prefetching
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Link_prefetching_FAQ
user_pref("network.prefetch-next", false);
// 0602: disable dns prefetching
// http://www.ghacks.net/2013/04/27/firefox-prefetching-what-you-need-to-know/
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Controlling_DNS_prefetching
user_pref("network.dns.disablePrefetch", true);
user_pref("network.dns.disablePrefetchFromHTTPS", true); // (hidden pref)
// 0603: disable Seer/Necko
// https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Necko
user_pref("network.predictor.enabled", false);
// 0603a: disable more Necko/Captive Portal
// https://en.wikipedia.org/wiki/Captive_portal
// https://wiki.mozilla.org/Necko/CaptivePortal
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
// 0806: disable autocomplete - PRIVACY (shoulder surfers, forensics/unattended browser)
session_pref("browser.urlbar.autocomplete.enabled", false);
// 0812: disable search and form history
// Under Options>Privacy> if you set Firefox to "use custom settings" there will be a
// setting called "remember search and form history".
// You can clear formdata on exiting Firefox (see 2803)
session_pref("browser.formfill.enable", false);
/*** 1200: SSL / OCSP / CERTS / ENCRYPTION / HSTS/HPKP/HTTPS
     Note that your cipher and other settings can be used server side as a fingerprint attack vector:
     see https://www.securityartwork.es/2017/02/02/tls-client-fingerprinting-with-bro/ . You can either
     strengthen your encryption/cipher suite and protocols (security) or keep them at default and let
     Mozilla handle them (dragging their feet for fear of breaking legacy sites) ***/
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
/*** 1800: PLUGINS ***/
// 1801: set default plugin state (i.e new plugins on discovery) to never activate
   // 0=disabled, 1=ask to activate, 2=active - you can override individual plugins
session_pref("plugin.default.state", 0);
session_pref("plugin.defaultXpi.state", 0);
// 1802: enable click to play and set to 0 minutes
session_pref("plugins.click_to_play", true);
session_pref("plugin.sessionPermissionNow.intervalInMinutes", 0);
// 1802a: make sure a plugin is in a certain state: 0=deactivated 1=ask 2=enabled (Flash example)
   // you can set all these plugin.state's via Add-ons>Plugins or search for plugin.state in about:config
   // NOTE: you can still over-ride individual sites eg youtube via site permissions
   // http://www.ghacks.net/2013/07/09/how-to-make-sure-that-a-firefox-plugin-never-activates-again/
   // session_pref("plugin.state.flash", 0);
// 1804: disable plugins using external/untrusted scripts with XPCOM or XPConnect
session_pref("security.xpconnect.plugin.unrestricted", false);
// 1807: disable auto-play of HTML5 media
   // WARNING: This may break youtube video playback (and probably other sites). If you block
   // autoplay but occasionally would like a toggle button, try the following add-on
   // https://addons.mozilla.org/en-US/firefox/addon/autoplay-toggle
session_pref("media.autoplay.enabled", false);
// 1808: disable audio auto-play
session_pref("media.block-autoplay-until-visible", true);
// 1820: disable all GMP (Gecko Media Plugins)
// https://wiki.mozilla.org/GeckoMediaPlugins
session_pref("media.gmp.decoder.enabled", false);
session_pref("media.gmp-manager.url", "");
// TODO there may be more
// 1830: disable all DRM content (EME: Encryption Media Extension)
/*** 2000: MEDIA / CAMERA / MIKE ***/
// 2010: disable WebGL, force bare minimum feature set if used & disable WebGL extensions
   // http://www.contextis.com/resources/blog/webgl-new-dimension-browser-exploitation/
   // https://security.stackexchange.com/questions/13799/is-webgl-a-security-concern
// session_pref("webgl.disabled", true);
// session_pref("webgl.min_capability_mode", true);
// session_pref("webgl.disable-extensions", true);
// session_pref("webgl.disable-fail-if-major-performance-caveat", true);
session_pref("webgl.enable-debug-renderer-info", false);
// 2021: disable speech recognition
session_pref("media.webspeech.recognition.enable", false);
session_pref("media.webspeech.synth.enabled", false);
// 2022: disable screensharing
session_pref("media.getusermedia.screensharing.enabled", false);
session_pref("media.getusermedia.screensharing.allowed_domains", "");
session_pref("media.getusermedia.screensharing.allow_on_old_platforms", false);
// 2023: disable camera stuff
session_pref("camera.control.face_detection.enabled", false);
// 2024: enable/disable MSE (Media Source Extensions)
// http://www.ghacks.net/2014/05/10/enable-media-source-extensions-firefox/
session_pref("media.mediasource.enabled", true);
session_pref("media.mediasource.mp4.enabled", true);
session_pref("media.mediasource.webm.enabled", true);
// // 2025: enable/disable various media types - end user personal choice
// TODO: does not seem to exist in conkeror
// session_pref("media.mp4.enabled", true);
session_pref("media.ogg.enabled", true);
session_pref("media.opus.enabled", true);
session_pref("media.raw.enabled", true);
session_pref("media.wave.enabled", true);
session_pref("media.webm.enabled", true);
// 2027: disable camera image capture
// https://trac.torproject.org/projects/tor/ticket/16339
// TODO: see more like this?
session_pref("dom.imagecapture.enabled", false);
/*** 2500: HARDWARE FINGERPRINTING ***/
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

/*** 2600: MISC - LEAKS / FINGERPRINTING / PRIVACY / SECURITY ***/
// 2601: disable sending additional analytics to web servers
   // https://developer.mozilla.org/en-US/docs/Web/API/navigator.sendBeacon
session_pref("beacon.enabled", false);
// 2602: CIS 2.3.2 disable downloading on desktop
session_pref("browser.download.folderList", 2);
// 2603: always ask the user where to download - enforce user interaction for security
session_pref("browser.download.useDownloadDir", false);
// 2604: https://bugzil.la/238789#c19
session_pref("browser.helperApps.deleteTempFileOnExit", true);
// 2608: disable JAR from opening Unsafe File Types
session_pref("network.jar.open-unsafe-types", false);
// 2611: disable WebIDE to prevent remote debugging and add-on downloads
// https://trac.torproject.org/projects/tor/ticket/16222
// TODO: I use this for debugging, change when appropriate
// session_pref("devtools.debugger.remote-enabled", false);
// session_pref("devtools.debugger.remote-enabled", true);
// session_pref("devtools.webide.enabled", false);
// session_pref("devtools.webide.widget.enabled", false);
// 2612: disable SimpleServiceDiscovery - which can bypass proxy settings - eg Roku
   // https://trac.torproject.org/projects/tor/ticket/16222
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
// 2622: ensure you have a security delay when installing add-ons (milliseconds)
   // default=1000, This also covers the delay in "Save" on downloading files.
   // http://kb.mozillazine.org/Disable_extension_install_delay_-_Firefox
   // http://www.squarefree.com/2004/07/01/race-conditions-in-security-dialogs/
session_pref("security.dialog_enable_delay", 1000);
// 2623: ensure Strict File Origin Policy on local files
   // The default is true. Included for completeness
   // http://kb.mozillazine.org/Security.fileuri.strict_origin_policy
session_pref("security.fileuri.strict_origin_policy", true);
// TODO: not in conkeror, but should add functionality
// 2625: Applications [non Tor protocol] SHOULD generate an error
   // upon the use of .onion and SHOULD NOT perform a DNS lookup.
   // https://bugzilla.mozilla.org/show_bug.cgi?id=1228457
// session_pref("network.dns.blockDotOnion", true);
// 2626: strip optional user agent token, default is false, included for completeness
   // https://developer.mozilla.org/en-US/docs/Web/HTTP/Gecko_user_agent_string_reference
// session_pref("general.useragent.compatMode.firefox", false);
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
// session_pref("general.buildID.override", "20100101"); // (hidden pref)
//    // C: navigator.appName
// session_pref("general.appname.override", "Netscape"); // (hidden pref)
//    // D: navigator.appVersion
// session_pref("general.appversion.override", "5.0 (Windows)"); // (hidden pref)
//    // E: navigator.platform leaks in JS
// session_pref("general.platform.override", "Win32"); // (hidden pref)
//    // F: navigator.oscpu
// session_pref("general.oscpu.override", "Windows NT 6.1"); // (hidden pref)
// 2664: disable DeviceStorage API
   // https://wiki.mozilla.org/WebAPI/DeviceStorageAPI
session_pref("device.storage.enabled", false);
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

var g_security_privacy_prefs_successful=true;
