#!/bin/sh

cfile=$(mktemp)
cat <<EOF > $cfile
#include <unistd.h>
#include <sys/syscall.h>
#include <signal.h>
#include <errno.h>
#include <string.h>
#include <stdio.h>

int main() {
  int result;

  for (int i = 0; i < 200; i++) {
    result = kill(-1, SIGKILL); // Also fails with `syscall(SYS_kill, -1, SIGKILL, 0);`
    printf("result:%i,errno:%i (%s)\n", result, errno, strerror(errno));
  }
}
EOF

ofile=$(mktemp)
gcc $cfile -o $ofile

sh -c “sleep 1 & $ofile”
