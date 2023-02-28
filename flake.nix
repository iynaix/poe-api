{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-22.11";
    devenv.url = "github:cachix/devenv";
  };

  outputs = { self, nixpkgs, devenv, ... } @ inputs:
    let
      systems = [ "x86_64-linux" ];
      forAllSystems = f: builtins.listToAttrs (map (name: { inherit name; value = f name; }) systems);
    in
    {
      devShells = forAllSystems
        (system:
          let
            pkgs = import nixpkgs {
              inherit system;
            };
          in
          {
            default = devenv.lib.mkShell {
              inherit inputs pkgs;
              modules = [
                {
                  # https://devenv.sh/reference/options/
                  packages = with pkgs; [ yarn ];

                  languages.javascript.enable = true;
                }
              ];
            };
          });
    };
}
