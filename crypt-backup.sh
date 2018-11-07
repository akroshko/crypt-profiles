#!/bin/bash
#
# Copyright (C) 2016-2018, Andrew Kroshko, all rights reserved.
#
# Author: Andrew Kroshko
# Maintainer: Andrew Kroshko <akroshko.public+devel@gmail.com>
# Created: Tue May 25, 2016
# Version: 20181030
# URL: https://github.com/akroshko/crypt-profiles
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or (at
# your option) any later version.
#
# This program is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see http://www.gnu.org/licenses/.

# XXXX: assumes my bash-stdlib library is installed, but can it be run as root?
source "$HOME/.bash_library"
# This script backs up a directory a disk of a particular uuid.
#
# Required:
# - backup drive part of logical volume with enough spare room for a snapshot
# - backup drive is mounted externally, I generally just let Gnome shell do this
# - a gpg key to encrypt (using an environment variable with a user)
# - uses 12GB of memory for buffering by default, although still stalls sometimes
#   and maximum possible memory would be good
# - no batch mode currently, script must be started interactively
# TODO: proper reset and unwind functions
# TODO: there's an issue with needing to manually unmount disk if nautilus has mounted automatically
# TODO: backup /home as default, try again... there are silly bugs here
# TODO: still issue with best way to manage root

# TODO: parse arguments a bit better
main () {
    local HELPTEXT="Usage: ./crypt-backup.sh [--help] [--reset] <<tar options...>>

    Use --reset with no other options to umount and remove all logical
    volumes.

    <<path>> should be the full path to backup

    Note that environment variables \$CRYPTGPGKEY \$CRYPTGPGUSER \$BACKUPHOSTNAME \$BACKUPUUID must be set.
"
    # [<<compression option>>] [<<compression level>>]
    # <<compression option>> (default --lzop) and <<compression level>> can be:
    #   --bzip2 with -1 (fast) to -9 (best) for <<compression level>>
    #   --gzip with -1 (fast) -6 (default) -9 (best) for <<compression level>>
    #   --lz4 with -1 (fast) to -9 (best) for <<compression level>>
    #   --lzop or empty <<compression option>>, with -1 (equiv fast) -3 to -6 (equiv default) -7 to -9 (equiv slow) for <<compression level>>
    #   --pigz with -1 (fast) -6 (default) -9 (best) for <<compression level>>
    #   --xz with -1 (fast) to -9 (best) with -6 (default) for <<compression level>>

    # XXXX: these must be set externally
    if [[ $@ == *"--help"* || -z "$CRYPTGPGKEY" || -z "$CRYPTGPGUSER" || -z "$BACKUPHOSTNAME" || -z "$BACKUPUUID" ]]; then
        echo "${HELPTEXT}"
        return 1
    fi
    if [[ $@ == *"--reset"* ]]; then
        # TODO: try all of these even if some are errors
        sudo umount /mnt-snapshot
        [[ "${HOSTNAME}" == "$BACKUPHOSTNAME" ]] && sudo lvremove /dev/crypt-main/backup-snapshot
    else
        # XXXX: this is a dangerous script, make sure it always fails on error
        #       but not before here
        set -e
        # XXXX: hard coded to ensure script does not screw anything up
        if [[ "${HOSTNAME}" == "$BACKUPHOSTNAME" ]]; then
            # TODO: bail if sudo not correct
            sudo true || return 1
            echo "Creating snapshot of /dev/crypt-main/home"
            # TODO: is this necessary?
            sync; sleep 10; sync
            # TODO: make sure I backup proper directory rather than home by default
            # TODO: no very useful
            sudo lvcreate --size 12G --snapshot --name backup-snapshot /dev/crypt-main/home
            sudo mount /dev/crypt-main/backup-snapshot /mnt-snapshot -o ro
        else
            return 1
        fi
        local BACKUPPATH="$(mount-disk-uuid ${BACKUPUUID})"
        if [[ $? != 0 ]]; then
            warn "Disk cannot be mounted or already mounted!!!"
            return 1
        fi
        if ! gpg --list-keys "${CRYPTGPGUSER}"; then
            gpg --import "${CRYPTGPGKEY}"
        fi
        pushd . >/dev/null
        # TODO: make this more flexible, replace down below
        cd /mnt-snapshot/"${USER}"
        # use pigz or http://compression.ca/pbzip2/ ???
        # http://dbahire.com/which-compression-tool-should-i-use-for-my-database-backups-part-ii-decompression/
        # http://www.krazyworks.com/multithreaded-encryption-and-compression/
        clear
        if [[ $@ == *"--bzip2"* ]]; then
            local COMPRESSPROG="bzip2"
            local COMPRESSLEVEL=
            local COMPRESSEXT="bz2"
        elif [[ $@ == *"--gzip"* ]]; then
            local COMPRESSPROG="gzip"
            local COMPRESSLEVEL=
            local COMPRESSEXT="gz"
        elif [[ $@ == *"--lz4"* ]]; then
            # TODO: possibly a good replacement for lzop
            local COMPRESSPROG="lz4"
            local COMPRESSLEVEL="-1"
            local COMPRESSEXT="lz4"
        elif [[ $@ == *"--pigz"* ]]; then
            # TODO: test this
            local COMPRESSPROG="pigz"
            local COMPRESSLEVEL=
            local COMPRESSEXT="gz"
        elif [[ $@ == *"--xz"* ]]; then
            local COMPRESSPROG="xz"
            local COMPRESSLEVEL=
            local COMPRESSEXT="xz"
        else
            # TODO: default compression level as 6, which is fast (do a test)
            local COMPRESSPROG="lzop"
            local COMPRESSLEVEL="-6"
            local COMPRESSEXT="lzo"
        fi
        # XXXX: . used, expect to change to directory in /mnt-snapshot/
        # TODO: shift eventually?
        # https://stackoverflow.com/questions/24197955/tar-excludes-option-to-exclude-only-the-directory-at-current-working-directory
        # https://unix.stackexchange.com/questions/32845/tar-exclude-doesnt-exclude-why
        # --verbose
        time tar "$@" --create  --file - . | "$COMPRESSPROG" "$COMPRESSLEVEL" | mbuffer -m 4096M | gpg-batch --compress-algo none --cipher-algo AES256 --recipient "$CRYPTGPGUSER" --output - --encrypt - | mbuffer -q -m 2048M -s 64k -o "${BACKUPPATH}/${HOSTNAME}"-home--$(date +%Y%m%d%H%M%S).tar."$COMPRESSEXT".gpg
        # local COMPRESSLEVEL="$3"
        popd >/dev/null
        # backup any luks headers here
        # make sure headers are backed up plaintext to backup drive for now
        pushd . >/dev/null
        cd "$BACKUPPATH"
        mkdir -p ./luks-header-backup
        cd ./luks-header-backup
        # XXXX: assumes all functions in the crypt-profiles repo are available
        crypt-luks-headers-backup-here
        popd >/dev/null
        # TODO: how to keep sudo going during this
        #       do not want backup done as root, but need it for other operations
        # TODO: do not want || return 1, figure out
        sudo true
        sudo umount /mnt-snapshot
        [[ "${HOSTNAME}" == "$BACKUPHOSTNAME" ]] && sudo lvremove /dev/crypt-main/backup-snapshot
    fi
}
main "$@"
