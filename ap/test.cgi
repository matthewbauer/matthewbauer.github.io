#!/usr/bin/perl

use CGI;
my $q = CGI->new;
print $q->header();
print $q->redirect('http://google.com');

