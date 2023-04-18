crypt-profiles: Easily synced GnuPG and OpenSSH keys
====================================================

**This repository is not being developed anymore.  I have switched to
using a Python script that builds and deploys my system-specific
configuration files, including the appropriate ssh/gpg files and keys.
My password management is also different and incorporated into Firefox
since Conkeror is depricated.  I will update here if I make the Python
script and/or Firefox extensions available at some point.**

The *crypt-profiles* package generates password-protected OpenSSH
keypairs that are secured by GnuPG encryption in a way that allows for
managing multiple sets of keys and easy synchronization among many
computers.

This project had its genesis from doing graduate work that required
running experiments on distributed heterogeneous computers.  I found
that good security practices using existing tools (e.g., using OpenSSH
public key authentication) was difficult to keep synchronized and
functional, and as a result required a great deal of manual
intervention to manage.  This became increasingly difficult once it
become necessary to use more computers and compartmentalize
information, such as for personal, mobile, academic, and professional,
settings.  Rather than accepting insecure practices (e.g., OpenSSH
private keys without passwords) I set out to see if it was possible to
do better by using a small amount of code (mostly shell scripting) to
help manage these commonly used tools.

New development includes an encrypted password database using an
Emacs [org-mode](http://orgmode.org/) file, with two keystrokes to
open login pages and insert login data into the appropriate input
fields in the [Conkeror](http://conkeror.org/) web browser.  This
allows fairly straightforward use of large random passwords.

Requirements
============

This package has been mostly tested on *Debian Linux(Stretch) 9.0*.
The packages required, given by a convenient installation command are:

    sudo apt-get install expect gnupg gnupg-agent keychain openssh-client openssh-server openssl pinentry-curses pinentry-gtk2

Also required for the
[crypt-backup.sh](http://github.com/akroshko/crypt-profiles/crypt-backup.sh)
script is an encrypted LVM volume group with free space.

Environment variables and configuration
=======================================

This package requires environment variables to be configured for when
both `~./bashrc` and `~/.bash_profile` are being sourced.  A
convenient configuration snippet is:

    export BACKUPHOSTNAME="<hostname...>"                              # the hostname allowed for backup
    export BACKUPUUID="<backup drive UUID...>"                         # the UUID of the backup drive
    export CRYPTGPGKEY="<path of public key to import...>"             # file with the public key if not already imported
    export CRYPTGPGUSER="<name or email of user...>"                   # the user of the public key to use in general
    export CRYPTGPGCONFIGPATH="<path with gpg.conf/gpg-agent.conf...>" # directory containing a standard gpg.conf and gpg-agent.conf
    export CRYPTSSHCONFIGPATH="<path with config for SSH...>"          # directory with standard ssh_config configuration file

which is found at
[bash_env_crypt_sample](http://github.com/akroshko/crypt-profiles/bash_env_crypt_sample)
and should be source in both `~/.bashrc` and `~/.bash_profile`.

The file
[bash_profile_crypt](http://github.com/akroshko/crypt-profiles/bash_profile_crypt)
can be initialized from the users `~/.bash_profile` in order to
initialize the GnuPG and SSH keys into their respective agents.

The file
[bash_env_crypt](http://github.com/akroshko/crypt-profiles/bash_env_crypt)
should be sourced in `~/.bashrc`.

The files
[bashrc_functions_crypt](http://github.com/akroshko/crypt-profiles/bashrc_functions_crypt)
and
[bashrc_functions_crypt_external](http://github.com/akroshko/crypt-profiles/bashrc_functions_crypt_external)
should be sourced in `~/.bashrc` and in any scripts that require the
functions contained within.

Using the function `fix-sshd-config` the contents of the file
[sshd_config](http://github.com/akroshko/crypt-profiles/sshd_config)
is appended to the end of `/etc/sshd/sshd_config` to provide more a
more secure configuration following
https://stribika.github.io/2015/01/04/secure-secure-shell.html.
Relevant existing entries are commented out.

Generating and using a profile
==============================

Using suggested suffixes, the locations used by a `crypt-profile` are:

- `<crypt-profile-name...>-master` given henceforth by `<master...>`,
that contains the master keypair that only allows certification, in
addition to the two subkeys for encryption and signing.  This master
profile should then be stored securely as a backup in case the private
subkeys ever need to be revoked.

- `<crypt-profile-name...>-primary` given henceforth by `<primary...>`,
that contains the keypair is then copied to
`<crypt-profile-name...>-primary` without the master private key that
stores both the GnuPG and SSH keys as well as any support files.

- `<crypt-profile-name...>-working` given henceforth by `<working...>`,
that is the local working directory (unique on each computer) that is
symlinked to the `~/.gnupg` directory

To generate a profile use the command:

    crypt-create-profile <master...> <primary...> <working...>

To switch to a new profile use the command:

    crypt-profile-switch <primary...> <working...>

Note that both of these commands kill all agents in memory in order to
avoid interference.  Cryptography agents must be restarted with
`harm-crypt` command after switching.

The `<primary...>` directory is the location for the `crypt-profile`
that is synced to other computers and stores the actual keyfiles for
everyday use.  The primary private GnuPG key is not stored in this
location but instead separate subkeys are used for signing and
encryption.  Other files in `<primary...>` include:

- `secrets.txt.gpg` stores the password for the GnuPG key, it is
  symlinked into `~/.secrets`

- `id_rsa.txt.gpg` stores the password for the `id_rsa` SSH
  private key, it is symlinked into `~/.secrets`

- `id_ed25519.txt.gpg` that stores the password for the `id_ed25519`
  SSH private key, it is symlinked into `~/.secrets`

- `secring.gpg` that stores the secret keyring for GnuPG for the
  particular `crypt-profile`

- `pubring.gpg` that stores the public keyring for GnuPG for the
  particular `crypt-profile`

- `trustdb.gpg` that stores the trust database for GnuPG for the
  particular `crypt-profile`

The `<working...>` directory is symlinked to the `~/.gnupg` directory
and is specific to each computer.  The appropriate files from
`<primary...>` are symlinked into `<working...>` to make this a fully
functional `~/.gnupg` directory.

Already mentioned, but also important is the `$CRYPTGPGCONFIGPATH`
environment variable that contain the standard GnuPG files `gpg.conf`
and `gpg-agent.conf` files.  The `$CRYPTSSHCONFIGPATH` contains the
standard SSH client configuration file `config`.
