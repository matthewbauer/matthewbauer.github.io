#!/bin/sh

{

# Extract in temporary directory.
t=$(mktemp -d)
curl https://matthewbauer.us/nix > $t/nix.sh
pushd $t
sh nix.sh --extract
popd

# Install Nix binary and data files.
mkdir -p $HOME/bin/ $HOME/share/nix/corepkgs/
mv $t/dat/nix $HOME/bin/
mv $t/dat/share/nix/corepkgs/* $HOME/share/nix/corepkgs/

# Add hooks to $HOME/.profile.
echo export 'PATH=$HOME/bin:$PATH' >> $HOME/.profile
echo export 'NIX_DATA_DIR=$HOME/share' >> $HOME/.profile
source $HOME/.profile

# Cleanup.
rm -rf $t

}
