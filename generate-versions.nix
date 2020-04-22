{ channels ? [ "20.03" "19.09" "19.03" "18.03" "17.03" "16.03" "15.09" "14.12" "14.04" ]
, attrs ? builtins.attrNames (import <nixpkgs> {})
, system ? builtins.currentSystem
, args ? { inherit system; }
}: let

  getSet = channel: (import (builtins.fetchTarball "channel:nixos-${builtins.toString channel}") args).pkgs;

  getPkg = name: channel: let
    pkgs = getSet channel;
    pkg = pkgs.${name};
    version = (builtins.parseDrvName pkg.name).version;
  in if builtins.hasAttr name pkgs && pkg ? name then {
    name = version;
    value = pkg;
  } else null;

in builtins.listToAttrs (map (name: {
  inherit name;
  value = builtins.listToAttrs
    (builtins.filter (x: x != null)
      (map (getPkg name) channels));
}) attrs)
