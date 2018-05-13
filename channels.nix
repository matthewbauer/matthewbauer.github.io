let mapAttrs = f: set: builtins.listToAttrs (
      map (attr: { name = attr; value = f attr set.${attr}; })
          (builtins.attrNames set));
    channels = {
      aardvark = "13.10";    # ?
      baboon = "14.04";      # ?
      caterpillar = "14.12"; # ?
      dingo = "15.09";       # ?
      emu = "16.03";         # ?
      flounder = "16.09";    # works on macOS High Sierra
      gorilla = "17.03";     # "library not loaded"
      hummingbird = "17.09"; # works on macOS High Sierra
      impala = "18.03";      # works on macOS High Sierra
    };
in mapAttrs (n: v:
     import (builtins.fetchTarball
             "https://nixos.org/channels/nixos-${v}/nixexprs.tar.xz") {})
   channels
