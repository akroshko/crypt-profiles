#!/bin/bash
main() {
    # TODO: this makes no sense
    if [[ $(id -u) != 0 ]]; then
        echo "Must run as root!"
        exit 1
    fi
    if [[ -z "$1" ]]; then
        echo "Must specify normal user!"
        exit 1
    fi
    # TODO: picket fences to check for argument and make sure running as sudo/root
    echo "Using user $1 for master-privacy"
    sudo -u "$1" -i master-privacy
    # XXXX: make sure coordinated with normal one
    kill-freespace-random-file-local () {
        local ROOTPATH="$1"
        if [[ -z "$ROOTPATH" ]]; then
            echo "Must specific directory corresponding to device to kill space on!!!"
            return 1
        fi
        if (( $(cat /proc/meminfo | grep --color=never MemTotal | awk '{print $2}') < "4194304" )); then
            echo "Setting THEBUFFERSIZE to 512M!"
            # TODO: set up local?
            local THEBUFFERSIZE="512M"
        else
            echo "Setting THEBUFFERSIZE to 2048M!"
            # TODO: set up local?
            local THEBUFFERSIZE="2048M"
        fi
        echo "Using $ROOTPATH"
        echo "Using buffer size $THEBUFFERSIZE!"
        time openssl enc -aes-256-ctr -pass pass:"$(dd if=/dev/urandom bs=128 count=1 2>/dev/null | base64)" -nosalt < /dev/zero | mbuffer -m "$THEBUFFERSIZE" -s 64k -A /bin/false -f -o "$ROOTPATH"/randomfile.bin
        sync
        sleep 60
        sync
        sleep 60
        echo "Size of written file:"
        du -sh "$ROOTPATH"/randomfile.bin
        du -shb "$ROOTPATH"/randomfile.bin
        sudo rm "$ROOTPATH"/randomfile.bin
    }
    if [[ "$(df / --output=source | grep --color=never -v ^Filesystem)" != "$(df /home --output=source | grep --color=never bash_profile_crypt -v ^Filesystem)" ]]; then
        # XXXX: this will almost run / out of space, but should be OK
        echo "---- / is not same device as /home, killing freespace on / first!"
        kill-freespace-random-file-local /
        echo "---- / is not same device as /home, killing freespace on /home now!"
        kill-freespace-random-file-local "/home/$1"
    else
        echo "---- / is same device as /home, no need to kill freespace on / seperately!"
        kill-freespace-random-file-local "/home/$1"
    fi
}
main "$@"
