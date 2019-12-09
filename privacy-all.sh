#!/bin/bash
main() {
    # TODO: this makes no sense
    if [[ $(id -u) != 0 ]]; then
        echo "Must run as root!" 1>&2
        exit 1
    fi
    if [[ -z "$1" ]]; then
        echo "Must specify normal user!" 1>&2
        exit 1
    fi
    # TODO: picket fences to check for argument and make sure running as sudo/root
    echo "Using user $1 for privacy" 1>&2
    sudo -u "$1" -i privacy-full
    # XXXX: make sure coordinated with normal one
    kill-freespace-random-file-local () {
        local ROOTPATH="$1"
        if [[ -z "$ROOTPATH" ]]; then
            echo "Must specific directory corresponding to device to kill space on!!!" 1>&2
            return 1
        fi
        if (( $(cat /proc/meminfo | grep --color=never MemTotal | awk '{print $2}') < "4194304" )); then
            echo "Setting THEBUFFERSIZE to 512M!" 1>&2
            # TODO: set up local?
            local THEBUFFERSIZE="512M"
        else
            echo "Setting THEBUFFERSIZE to 2048M!" 1>&2
            # TODO: set up local?
            local THEBUFFERSIZE="2048M"
        fi
        echo "Using $ROOTPATH" 1>&2
        echo "Using buffer size $THEBUFFERSIZE!" 1>&2
        time openssl enc -aes-256-ctr -pass pass:"$(dd if=/dev/urandom bs=128 count=1 2>/dev/null | base64)" -nosalt < /dev/zero | mbuffer -m "$THEBUFFERSIZE" -s 64k -A /bin/false -f -o "$ROOTPATH"/randomfile.bin
        sync
        sleep 60
        sync
        sleep 60
        echo "Size of written file:" 1>&2
        du -sh "$ROOTPATH"/randomfile.bin
        du -shb "$ROOTPATH"/randomfile.bin
        sudo \rm "$ROOTPATH"/randomfile.bin
    }
    if [[ "$(df / --output=source | grep --color=never -v ^Filesystem)" != "$(df /home --output=source | grep --color=never bash_profile_crypt -v ^Filesystem)" ]]; then
        # XXXX: this will almost run / out of space, but should be OK
        echo "---- / is not same device as /home, killing freespace on / first!" 1>&2
        kill-freespace-random-file-local /
        echo "---- / is not same device as /home, killing freespace on /home now!" 1>&2
        kill-freespace-random-file-local "/home/$1"
    else
        echo "---- / is same device as /home, no need to kill freespace on / seperately!" 1>&2
        kill-freespace-random-file-local "/home/$1"
    fi
}
main "$@"
