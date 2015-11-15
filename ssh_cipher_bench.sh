#!/bin/bash
# script from stack overflow but do not have link to attribute it
# TODO: my current configuration no longer supports all these ciphers
#       test better for existing cipher and have override for
#       experimental purposes
#       maybe restart sshd with temporary options?
# TODO: have different workloads such as specifying host or data set other than a random file
user=akroshko
# TODO: work with this
# password=<the password>
port=22
MB=2048

export LC_ALL=C
# all current SSH version 2 ciphers
ciphers="3des-cbc aes128-cbc aes192-cbc aes256-cbc aes128-ctr aes192-ctr \
         aes256-ctr aes128-gcm@openssh.com aes256-gcm@openssh.com arcfour \
         arcfour128 arcfour256 blowfish-cbc cast128-cbc chacha20-poly1305@openssh.com"

# ciphers=$(ssh -Q cipher)

# create a file of random garbage in ram
# TODO: make sure that this works
echo "Creating a random file in ram."
sudo mkdir -p /mnt-ram
sudo mount -o size=$((MB*1024))M -t tmpfs none /mnt-ram
# allow anymore to access the disk
sudo dd if=/dev/urandom of=/mnt-ram/random.bin bs=1M count=$MB conv=sync
echo "Random file of size ${MB}M created in ram!"

for cipher in $ciphers; do
    echo "================================================================================"
    echo cipher: "$cipher"
    # dd if=/dev/zero bs=1M count=$MB conv=sync  | \
    #     sshpass -p $password ssh -c $cipher -o Compression=no -o Port=$port $user@127.0.0.1 "cat - >/dev/null"
    echo "Compression yes:"
    dd if=/mnt-ram/random.bin bs=1M count=$MB conv=sync | \
        ssh -c $cipher -o Compression=yes -o Port=$port $user@127.0.0.1 "cat - >/dev/null"
    echo "Compression no:"
    dd if=/mnt-ram/random.bin bs=1M count=$MB conv=sync | \
        ssh -c $cipher -o Compression=no -o Port=$port $user@127.0.0.1 "cat - >/dev/null"
done
sudo umount /mnt-ram
