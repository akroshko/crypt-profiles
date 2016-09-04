;;; crypt-profiles-password-database.el
;;
;; Copyright (C) 2016, Andrew Kroshko, all rights reserved.
;;
;; Author: Andrew Kroshko
;; Maintainer: Andrew Kroshko <akroshko.public+devel@gmail.com>
;; Created: Mon Jun 20, 2016
;; Version: 20160716
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

(defvar crypt-profiles-password-database-path
  nil
  "Path for an .org.gpg encrypted password database.")

(defun crypt-profiles-get-matching-password (base64-url &optional alternate)
  ;; TODO make sure file decrypts before proceeding
  ;; TODO: hard coding is bad
  (with-current-file crypt-profiles-password-database-path
    (goto-char (point-min))
    ;; goto heading
    (if alternate
        (cic:org-find-headline "Website Logins Alternate")
      (cic:org-find-headline "Website Logins"))
    ;; TODO: this is a kludge
    (forward-line 2)
    (forward-char 4)
    (let ((url (base64-decode-string base64-url))
          (the-lisp-table (cic:org-table-to-lisp-no-separators))
          return-value)
      (dolist (lisp-row the-lisp-table)
        (let ((name (cic:strip-full (elt lisp-row 1)))
              (autourl (cic:strip-full (elt lisp-row 2))))
          (when (and (not (equal autourl "")) (string-match autourl url))
            (setq return-value (list name (elt lisp-row 4) (elt lisp-row 5))))))
      ;; make things command line safe
      ;; TODO: base64 encode
      (json-encode return-value))))

(provide 'crypt-profiles-password-database)
