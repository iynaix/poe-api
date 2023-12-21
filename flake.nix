{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    systems.url = "github:nix-systems/default";
    devenv.url = "github:cachix/devenv";
  };

  outputs = {
    self,
    nixpkgs,
    devenv,
    systems,
    ...
  } @ inputs: let
    forEachSystem = nixpkgs.lib.genAttrs (import systems);
  in {
    devShells =
      forEachSystem
      (system: let
        pkgs = nixpkgs.legacyPackages.${system};
      in {
        default = devenv.lib.mkShell {
          inherit inputs pkgs;
          modules = [
            {
              # https://devenv.sh/reference/options/
              dotenv.disableHint = true;

              scripts.yarn-reset.exec = ''
                rm -rf node_modules && rm yarn.lock && rm -rf .next && yarn
              '';

              packages = with pkgs; [
                yarn

              (pkgs.fetchYarnDeps {
                yarnLock = ./yarn.lock;
                sha256 = lib.fakeSha256;
              })
              ];

              languages.javascript.enable = true;
              languages.typescript.enable = true;

            }
          ];
        };
      });
  };
}
