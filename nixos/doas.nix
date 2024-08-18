{ config, vars, ... }:

{
  security = {
    sudo.enable = false;
    doas.enable = true;
    doas.extraRules = [
      {
        users = [ "${vars.user}" ];
        keepEnv = true;
        persist = true;
      }
    ];
  };

  environment.shellAliases = {
    sudo = "doas";
  };
}
