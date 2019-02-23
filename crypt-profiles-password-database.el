;;; crypt-profiles-password-database.el
;;
;; Copyright (C) 2016-2018, Andrew Kroshko, all rights reserved.
;;
;; Author: Andrew Kroshko
;; Maintainer: Andrew Kroshko <akroshko.public+devel@gmail.com>
;; Created: Mon Jun 20, 2016
;; Version: 20180918
;; URL: https://github.com/akroshko/crypt-profiles
;;
;; This program is free software; you can redistribute it and/or
;; modify it under the terms of the GNU General Public License as
;; published by the Free Software Foundation; either version 3, or
;; (at your option) any later version.
;;
;; This program is distributed in the hope that it will be useful,
;; but WITHOUT ANY WARRANTY; without even the implied warranty of
;; MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
;; General Public License for more details.
;;
;; You should have received a copy of the GNU General Public License
;; along with this program; see the file COPYING.  If not, write to
;; the Free Software Foundation, Inc., 51 Franklin Street, Fifth
;; Floor, Boston, MA 02110-1301, USA.
;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
;; Commentary:
;;
;; Assumes Emacs is configured to open or already have opened the
;; appropriate secrets.org.gpg file used as the password database.
;;
;;; Code:

(require 'cl)
(require 'json)


;; TODO: not sure this will work for everyone, this is just what I use in my config files
(when (file-exists-p "~/.gpg-agent-info.env")
  (let ((gpg-agent
        ;; read the file
         (s-trim-full (with-temp-buffer
                  (insert-file-contents "~/.gpg-agent-info.env")
                  (buffer-string)))))
    ;; set the variable
    (setenv "GPG_AGENT_INFO" gpg-agent)))
(setq epa-file-select-keys 'silent
      epg-gpg-program "/usr/bin/gpg2")
(epa-file-enable)

;; XXXX: set filename filter if not already set, used for filenames in
;; special formats that may be declared late
(unless (fboundp 'with-filename-filter)
  (fset 'with-filename-filter 'identity))

(defun s-trim-full (str)
  "Strip full leading and trailing whitespace from STR.  Does
this for every line."
  (while (string-match "\\`\n+\\|^\\s-+\\|\\s-+$\\|\n+\\'"
                       str)
    (setq str (replace-match "" t t str)))
  str)

(defmacro with-current-file-min (filename &rest body)
  "Like with-current-file, but always go to point-min."
  (declare (indent 1) ;; (debug t)
           )
  `(save-excursion
     (set-buffer (find-file-noselect (with-filename-filter ,filename)))
     (goto-char (point-min))
     ,@body))

(defun cic:org-find-headline (headline &optional buffer)
  "Find a particular HEADLINE in BUFFER."
  (goto-char (org-find-exact-headline-in-buffer headline)))

(defun cic:org-table-to-lisp-no-separators ()
  "Convert the org-table to lisp and eliminate seperators."
  (remove-if-not (lambda (x) (if (eq x 'hline) nil x)) (org-table-to-lisp)))

(defvar crypt-profiles-password-database-path
  nil
  "Path for an .org.gpg encrypted password database.")
;; TODO: this is probably a security problem
(when (file-exists-p "~/.crypt-database-path.el")
  (load "~/.crypt-database-path.el"))

;; (crypt-profiles-get-matching-password "aHR0cHM6Ly93d3cudHdpdHRlci5jb20=" 3)
(defun crypt-profiles-get-matching-password (base64-url &optional alternate)
  ;; TODO make sure file decrypts before proceeding
  ;; TODO: hard coding is bad
  (with-current-file-transient-min crypt-profiles-password-database-path
    ;; goto heading
    (cond ((equal alternate 6)
           (cic:org-find-headline "Website Logins 6"))
          ((equal alternate 5)
           (cic:org-find-headline "Website Logins 5"))
          ((equal alternate 4)
           (cic:org-find-headline "Website Logins 4"))
          ((equal alternate 3)
           (cic:org-find-headline "Website Logins 3"))
          (alternate
           (cic:org-find-headline "Website Logins 2"))
          (t
           (cic:org-find-headline "Website Logins 1")))
    ;; TODO: this is a kludge, advance to table better
    (forward-line 2)
    (forward-char 4)
    (let ((url (base64-decode-string base64-url))
          (the-lisp-table (cic:org-table-to-lisp-no-separators))
          return-value)
      (dolist (lisp-row the-lisp-table)
        (let ((name (s-trim-full (elt lisp-row 1)))
              (autourl (s-trim-full (elt lisp-row 2))))
          (when (and (not (equal autourl "")) (string-match autourl url))
            (setq return-value (list name (elt lisp-row 4) (elt lisp-row 5))))))
      ;; make things command line safe
      ;; TODO: base64 encode
      (json-encode return-value))))

;; (provide 'crypt-profiles-password-database)
