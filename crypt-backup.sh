#!/bin/bash
# XXXX: assumes ??? is instlalled, but can it be run as root?
source ~/.bash_library
# This script backs up a directory a disk of a particular uuid.
#
# Required:
# - backup drive part of logical volume with enough spare room for a snapshot
# - backup drive is mounted externally, I generally just let Gnome shell do this
# - a gpg key to encrypt (using an environment variable with a user)
# - uses 12GB of memory for buffering by default, although still stalls sometimes
#   and maximum possible memory would be good
# - no batch mode currently, script must be started interactively
# TODO: pigz test and help message
# TODO: proper reset and unwind functions
# TODO: there's an issue with needing to manually unmount disk if nautilus has mounted automatically

HELPTEXT="Usage: ./backup.sh [--help] [--reset] <<path>> [<<compression option>>] [<<compression level>>]

Use --reset with no other options to umount and remove all logical
volumes.

<<path>> should be the full path to backup

<<compression option>> (default --lzop) and <<compression level>> can be:
  --bzip2 with -1 (fast) to -9 (best) for <<compression level>>
  --gzip with -1 (fast) -6 (default) -9 (best) for <<compression level>>
  --lz4 with -1 (fast) to -9 (best) for <<compression level>>
  --lzop or empty <<compression option>>, with -1 (equiv fast) -3 to -6 (equiv default) -7 to -9 (equiv slow) for <<compression level>>
  --pigz with -1 (fast) -6 (default) -9 (best) for <<compression level>>
  --xz with -1 (fast) to -9 (best) with -6 (default) and -1e to -9e extreme (slow!!!) for <<compression level>>"

# XXXX: run as root due to all the disk operations
# TODO: make this nicer
# TODO: these must be set externally
if [[ "$1" == "--help" || -z "$CRYPTGPGKEY" || -z "$CRYPTGPGUSER" || -z "$BACKUPHOSTNAME" || -z "$BACKUPUUID" || -z "$1" ]]
then
    echo "${HELPTEXT}"
    exit 1
fi
if [[ "$1" == "--reset" ]]
then
    # TODO: try all of these even if some are errors
    sudo umount /mnt-snapshot
    if [[ $(hostname) == "$BACKUPHOSTNAME" ]]
    then
       sudo lvremove /dev/crypt-main/backup-snapshot
    fi
else
    # XXXX: this is a dangerous script, make sure it always fails on error
    #       but not before here
    set -e
    # XXXX: hard coded to ensure script does not screwn anything up
    if [[ $(hostname) == "$BACKUPHOSTNAME" ]]
    then
        # TODO: is this necessary
        sync; sleep 10; sync
        sudo lvcreate --size 12G --snapshot --name backup-snapshot /dev/crypt-main/home
        sudo mount /dev/crypt-main/backup-snapshot /mnt-snapshot -o ro
    else
        exit 1
    fi
    # TODO: throw an error if this node does not exist
    BACKUPPATH="$(mount-disk-uuid ${BACKUPUUID})"
    if [[ $? != 0 ]]
    then
        echo "Disk cannot be mounted or already mounted!!!"
        exit 1
    fi
    if ! gpg --list-keys "${CRYPTGPGUSER}"
    then
        gpg --import "${CRYPTGPGKEY}"
    fi
    pushd . >> /dev/null
    cd /mnt-snapshot/
    # use pigz or http://compression.ca/pbzip2/
    # http://dbahire.com/which-compression-tool-should-i-use-for-my-database-backups-part-ii-decompression/
    # http://www.krazyworks.com/multithreaded-encryption-and-compression/
    clear
    if [[ "$2" == "--bzip2" ]]
    then
        COMPRESSPROG="bzip2"
        COMPRESSEXT="bz2"
    elif [[ "$2" == "--gzip" ]]
    then
        COMPRESSPROG="gzip"
        COMPRESSEXT="gz"
    elif [[ "$2" == "--lz4" ]]
    then
        # TODO: possibly a good replacement for lzop
        COMPRESSPROG="lz4"
        COMPRESSEXT="lz4"
    elif [[ "$2" == "--pigz" ]]
    then
        # TODO: test this
        COMPRESSPROG="pigz"
        COMPRESSEXT="gz"
    elif [[ "$2" == "--xz" ]]
    then
        COMPRESSPROG="xz"
        COMPRESSEXT="xz"
    else
        COMPRESSPROG="lzop"
        COMPRESSEXT="lzo"
    fi
    if [[ -n "$3" ]]
    then
        COMPRESSLEVEL="$3"
        time tar --create --file - "$1" | "${COMPRESSPROG}" "${COMPRESSLEVEL}" | mbuffer -m 8192M | gpg --compress-algo none --cipher-algo AES256 --recipient "${CRYPTGPGUSER}" --output - --encrypt - | mbuffer -q -m 2048M -s 64k -o ${BACKUPPATH}/$(hostname)-home--$(date +%Y%m%d%H%M%S).tar."${COMPRESSEXT}".gpg
    else
        time tar --create --file - "$1" | "${COMPRESSPROG}" | mbuffer -m 8192M | gpg --compress-algo none --cipher-algo AES256 --recipient "${CRYPTGPGUSER}" --output - --encrypt - | mbuffer -q -m 2048M -s 64k -o ${BACKUPPATH}/$(hostname)-home--$(date +%Y%m%d%H%M%S).tar."${COMPRESSEXT}".gpg
    fi
    popd >> /dev/null
    sudo umount /mnt-snapshot
    if [[ $(hostname) == "$BACKUPHOSTNAME" ]]
    then
       sudo lvremove /dev/crypt-main/backup-snapshot
    fi
fi
