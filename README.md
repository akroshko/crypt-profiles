crypt-profiles: Easily synced GnuPG and OpenSSH keys
====================================================

The *crypt-profiles* package generates password-protected OpenSSH
keypairs that are secured by GnuPG encryption in a way that allows for
managing multiple sets of keys and easy synchronization among many
computers.

This project has its genesis from doing my graduate work on
distributed heterogeneous computers, and finding that good security
practices using existing tools (e.g., using OpenSSH public key
authenication) was difficult.  I found it became increasingly
difficult as the need to use more computers and compartmentalize
information became necessary.  Rather than accepting insecure
practices (e.g., OpenSSH private keys without passwords) I decided to
see if it was possible to do better by using a small amount of code
based on commonly used tools (most shell scripting).

New development includes an encrypted password database using an Emacs
org-mode file, with automatic opening of login pages and insertion
into the appropriate input fields in the
[Conkeror web browser](http://conkeror.org/).

WARNING: This project is an experiment in high-level usability of
common cryptography tools for everyday use, rather than being a secure
system for production use.  Despite being better and more convenient
than insecurely used private keys; there is still much to be desired
in terms of completeness, robustness, and security.  IT WOULD NOT
CURRENTLY PASS CLOSE INSPECTION OF A SECURITY PROFESSIONAL.  USE AT
YOUR OWN RISK!

Requirements
============

This package has been mostly tested on *Debian Linux(Jessie) 8.2*.
The packages required, given by a convenient installation command are:

    sudo apt-get install bleachbit expect gnupg gnupg-agent keychain openssh-client openssh-server openssl pinentry-curses pinentry-gtk2 secure_delete

Also required for the
[crypt-backup.sh](http://github.com/akroshko/crypt-profiles/crypt-backup.sh)
script is an encrypted LVM volume group with free space.

Detailed description
====================

From the website, [GnuPG](https://gnupg.org):

"GnuPG allows you to encrypt and sign your data and communication,
features a versatile key management system as well as access modules
for all kinds of public key directories."

[OpenSSH](http://www.openssh.com/) is a secure, trusted, and popular
software package for remotely logging into computers that is used by
industry, academia, and hobbyists.  In particular, I use it for
scientific computing, for either cluster computing or when widely
dispersed and heterogeneous computing resources are required.

Automatically generating and managing multiple sets of keys targeted
to different purposes for GnuPG and OpenSSH can be problematic.  The
*crypt-profiles* package is an attempt to make managing multiple SSH
keys for different purposes much easier and provide helper functions
for working with agent-stored GnuPG and SSH private keys.  I have
found I can easily work with a dozen different computers and set up
new ones, while only having to enter passwords once a day (unless
rebooting or for the initial login to a remote server).  Functions are
also provided for tasks such as file encryption and backups using only
the GnuPG public key.

In order to avoid entering passwords too regularly (especially when
using automated or unattended scripts), public/private keypairs are
widely used for SSH authentication.  However, to be secure the SSH
private key itself requires a password that either must be entered
every time or stored in memory with an agent that can be inconvenient
to set up.  Due to this, in practice, many SSH private keys are
generated without passwords and are often synchronized insecurely
(such as via email).

## A `crypt-profile`

Each `crypt-profile` is based on a master GnuPG key that is secured
with a user-remembered password and stored in the GnuPG agent.  The
associated SSH private keys are each secured using a 30-character
random password that is stored in a GnuPG-encrypted file.  All
passwords are stored in the appropriate agents so only the GnuPG
master password needs to be remembered and entered periodically.

This also ensures only the master password for the GnuPG private key
needs to be kept secure, although keeping the GnuPG and SSH private
keys secure would still be good practice.

Each `crypt-profile` resides in its own directory, that can easily be
synced to other computers, and includes a working directory that is
specific to the computer.  A simple bash command
`crypt-switch-profile` can select the new directories corresponding to
a different `crypt-profile` and reinitialize any running GnuPG or SSH
agents.

Additional functions provided include:

- file encryption using only a public GnuPG key and easy decryption
once in a safe environment with the appropriate GnuPG private key

- use of encrypted LUKS containers, alone and on an encrypted volume
group container

- a backup script that uses only a GnuPG public-key, which allows
  online backing up or archiving of a directory in an insecure
  environment

- filling free space on a hard drive with random numbers

- wiping common places on a *Linux* system where private information
  (thumbnails, history, etc.) is cached

Environment variables and configuration
=======================================

This package requires environment variables to be configured for when
both `~./bashrc` and `~/.bash_profile` are being sourced.  A
convenient configuration snippet is:

    export BACKUPHOSTNAME="<<hostname>>"                              # the hostname allowed for backup
    export BACKUPUUID="<<backup drive UUID>>"                         # the UUID of the backup drive
    export CRYPTGPGKEY="<<path of public key to iport>>"              # file with the public key if not already imported
    export CRYPTGPGUSER="<<name or email of user>>"                   # the user of the public key to use in general
    export CRYPTGPGCONFIGPATH="<<path with gpg.conf/gpg-agent.conf>>" # directory containing a standard gpg.conf and gpg-agent.conf
    export CRYPTSSHCONFIGPATH="<<path with config for SSH>>"          # directory with standard ssh_config configuration file

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

- `<<crypt-profile-name>>-master` given henceforth by `<<master>>`,
that contains the master keypair that only allows certification, in
addition to the two subkeys for encryption and signing.  This master
profile should then be stored securely as a backup in case the private
subkeys ever need to be revoked.

- `<<crypt-profile-name>>-primary` given henceforth by `<<primary>>`,
that contains the keypair is then copied to
`<<crypt-profile-name>>-primary` without the master private key that
stores both the GnuPG and SSH keys as well as any support files.

- `<<crypt-profile-name>>-working` given henceforth by `<<working>>`,
that is the local working directory (unique on each computer) that is
symlinked to the `~/.gnupg` directory

To generate a profile use the command:

    crypt-create-profile <<master>> <<primary>> <working>>

To switch to a new profile use the command:

    crypt-switch-profile <<primary>> <working>>

Note that both of these commands kill all agents in memory in order to
avoid interference.  Cryptography agents must be restarted with
`harm-crypt` command after switching.

The `<<primary>>` directory is the location for the `crypt-profile`
that is synced to other computers and stores the actual keyfiles for
everyday use.  The primary private GnuPG key is not stored in this
location but instead separate subkeys are used for signing and
encryption.  Other files in `<<primary>>` include:

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

The `<<working>>` directory is symlinked to the `~/.gnupg` directory
and is specific to each computer.  The appropriate files from
`<<primary>>` are symlinked into `<<working>>` to make this a fully
functional `~/.gnupg` directory.

Already mentioned, but also important is the `$CRYPTGPGCONFIGPATH`
environment variable that contain the standard GnuPG files `gpg.conf`
and `gpg-agent.conf` files.  The `$CRYPTSSHCONFIGPATH` contains the
standard SSH client configuration file `config`.

Encrypted containers and volume groups
======================================

TODO: add instructions

Encrypted backups
=================

TODO: add instructions

Conkeror/Emacs GPG encrypted password database
==============================================

TODO: add instructions


Planned development
===================

It is widely accepted that public key-distribution a very difficult
problem in cryptography.  This is even the case in a single-user
many-computer setting.

- allow automatic rotation and of passwords and keys between profiles

- make it easier to have a public-key-only profile, for instance, for
  mobile or travel applications where information can be encrypted and
  later decrypted in a secure environment

- sharing of public GPG and SSH keys among profiles with minimal
  difficulty

- sharing of and setting up appropriate authorized SSH public keys
  with minimal issues

- better sharing of and acquisition of key fingerprints, including a
  master database

- incorporation of a gpg-encrypted password database (under
  development but not included yet)

- override the `$CRYPTGPGCONFIGPATH` and `$CRYPTSSHCONFIGPATH`
  environment with command-line options

- better interface to the `crypt-create-profile` function and only one
  password entry required

- better handling of "paper" copies of keys for backup purposes

- add instructions on using backups and actually ensuring keys are
  available to restore

- add instructions concerning containers and volume groups

- address isses for syncing a `crypt-profile`

- manage client certificates for web browsers

- add things like (encrypted) preshared keys, e.g., for OpenVPN, after
  profile has been created

- create a one-time password encrypted method for sharing private key
  (or crypt-profile) initially via USB key

## Bugs

- find an elegant way to deal with conflicts with the GNOME keyring

- more robust recovery from errors

- script to check and modify `sshd_config`, and similar files, to be
  more secure

- allow
  [crypt-backup.sh](http://github.com/akroshko/crypt-profiles/crypt-backup.sh)
  to be run as root and make it more flexible where it is run

- there are issues with reinitializing after a hibernation or sleep
  (often required opening and closing several terminals and running
  `harm-crypt` several times)

- evaluate any issues that might occur because `<<crypt-profile-name>>-master`
  lies dormant while `<<crypt-profile-name>>-primary` gets used and
  changed

- some serious consideration of security issues with this package
