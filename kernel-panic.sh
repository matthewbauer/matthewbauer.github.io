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

  sleep(1);

  for (int i = 0; i < 20; i++) {
    result = syscall(SYS_kill, -1, SIGKILL, 0);
    printf("result:%i,errno:%i (%s)\n", result, errno, strerror(errno));
  }
}
EOF

ofile=$(mktemp).o
gcc $cfile -o $ofile

$ofile
