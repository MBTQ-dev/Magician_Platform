{pkgs}: {
  deps = [
    pkgs.postgresql
    pkgs.nix-output-monitor
    pkgs.git
    pkgs.nodejs-20_x
    pkgs.nodePackages.typescript
    pkgs.nodePackages.npm
  ];
  
  # Environment setup
  env = {
    NODE_OPTIONS = "--max-old-space-size=4096";
  };
}
