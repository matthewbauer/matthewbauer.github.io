#!/bin/sh

cfile=$(mktemp).c
cat <<EOF >> $cfile
#include <unistd.h>
#include <sys/syscall.h>
#include <signal.h>
#include <errno.h>
#include <string.h>
#include <stdio.h>

int main() {
  int result;

  for (int i = 0; i < 200; i++) {
    result = kill(-1, SIGKILL);
    printf("result:%i,errno:%i (%s)\n", result, errno, strerror(errno));
  }
}
EOF

ofile=$(mktemp).o
gcc $cfile -o $ofile

sh -c “sleep 1 & $ofile”
