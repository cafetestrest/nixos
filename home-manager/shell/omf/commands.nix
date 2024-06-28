{ config, pkgs, ... }:

{
  programs.fish = {
    functions = {
      autoload = {
        body = ''
          switch "$argv[1]"
          case '-e' '--erase'
            test (count $argv) -ge 2
              and __autoload_erase $argv[2..-1]
              or echo "usage: autoload $argv[1] <path>..." >&2
          case "-*" "--*"
            echo "autoload: invalid option $argv[1]"
            return 1
          case '*'
            test (count $argv) -ge 1
              and __autoload_insert $argv
              or echo "usage: autoload <path>..." >&2
          end
        '';
      };

      "__autoload_insert" = {
        body = ''
          set -l function_path
          set -l complete_path
          for path in $argv
            not test -d "$path"; and continue
            set -l IFS '/'
            echo $path | read -la components
            if test "x$components[-1]" = xcompletions
              contains -- $path $fish_complete_path
                or set complete_path $complete_path $path
            else
              contains -- $path $fish_function_path
                or set function_path $function_path $path
            end;
          end;
          test -n "$function_path"
            and set fish_function_path $fish_function_path[1] $function_path $fish_function_path[2..-1]
          test -n "$complete_path"
            and set fish_complete_path $fish_complete_path[1] $complete_path $fish_complete_path[2..-1]
          return 0
        '';
      };

      "__autoload_erase" = {
        body = ''
          set -l function_indexes
          set -l complete_indexes
          for path in $argv
            set -l IFS '/'
            echo $path | read -la components
            test "x$components[-1]" = xcompletions
              and set complete_indexes $complete_indexes (contains -i $path $fish_complete_path)
              or  set function_indexes $function_indexes (contains -i $path $fish_function_path)
          end;
          test -n "$function_indexes"
            and set -e fish_function_path["$function_indexes"]
          test -n "$complete_indexes"
            and set -e fish_complete_path["$complete_indexes"]
          return 0
        '';
      };

      prompt_segments = {
        body = ''
          set -l root (prompt_pwd | cut -d "/" -f1)
          if test -z "$root"
            echo "/"
          else
            echo "$root"
          end
          set -l path (prompt_pwd | cut -d "/" -f2-)
          set -l dir (dirname $path)
          if test $dir != "."
            echo $dir
          end
          set -l base (basename $path)
          if test -n "$base" -a "$base" != "~"
            echo $base
          end
        '';
      };

      require = {
        body = ''
          set packages $argv

          if test -z "$packages"
            echo 'usage: require <name>...'
            echo '       require --path <path>...'
            echo '       require --no-bundle --path <path>...'
            return 1
          end

          # If bundle should be
          if set index (contains -i -- --no-bundle $packages)
            set -e packages[$index]
            set ignore_bundle
          end

          # Requiring absolute paths
          if set index (contains -i -- --path $packages)
            set -e packages[$index]
            set package_path $packages

          # Requiring specific packages from default paths
          else
            set package_path {$OMF_PATH,$OMF_CONFIG}/pkg*/$packages

            # Exit with error if no package paths were generated
            test -z "$package_path"
              and return 1
          end

          set function_path $package_path/functions*
          set complete_path $package_path/completions*
          set init_path $package_path/init.fish*
          set conf_path $package_path/conf.d/*.fish

          # Autoload functions
          test -n "$function_path"
            and set fish_function_path $fish_function_path[1] \
                                      $function_path \
                                      $fish_function_path[2..-1]

          # Autoload completions
          test -n "$complete_path"
            and set fish_complete_path $fish_complete_path[1] \
                                      $complete_path \
                                      $fish_complete_path[2..-1]

          for init in $init_path
            emit perf:timer:start $init
            set -l IFS '/'
            echo $init | read -la components

            set path (printf '/%s' $components[1..-2])

            contains $path $omf_init_path
              and continue

            set package $components[-2]

            if not set -q ignore_bundle
              set bundle $path/bundle
              set dependencies

              if test -f $bundle
                set -l IFS ' '
                while read -l type dependency
                  test "$type" != package
                    and continue
                  require "$dependency"
                  set dependencies $dependencies $dependency
                end < $bundle
              end
            end

            source $init $path

            emit init_$package $path

            set -g omf_init_path $omf_init_path $path
            emit perf:timer:finish $init
          end

          for conf in $conf_path
            source $conf
          end

          return 0
        '';
      };

      git_branch_name = {
        body = ''
          git_is_repo; and begin
            command git symbolic-ref --short HEAD 2> /dev/null;
              or command git show-ref --head -s --abbrev | head -n1 2> /dev/null
          end
        '';
      };

      git_is_dirty = {
        body = ''
          git_is_worktree; and not command git diff --no-ext-diff --quiet --exit-code
        '';
      };

      git_is_repo = {
        body = ''
          test -d .git
          or begin
            set -l info (command git rev-parse --git-dir --is-bare-repository 2>/dev/null)
            and test $info[2] = false
          end
        '';
      };

      git_is_staged = {
        body = ''
          git_is_repo; and begin
            not command git diff --cached --no-ext-diff --quiet --exit-code
          end
        '';
      };

      git_is_stashed = {
        body = ''
          git_is_repo; and begin
            command git rev-parse --verify --quiet refs/stash >/dev/null
          end
        '';
      };

      git_is_touched = {
        body = ''
          git_is_worktree; and begin
            # The first checks for staged changes, the second for unstaged ones.
            # We put them in this order because checking staged changes is *fast*.  
            not command git diff-index --cached --quiet HEAD -- >/dev/null 2>&1
            or not command git diff --no-ext-diff --quiet --exit-code >/dev/null 2>&1
          end
        '';
      };

      git_is_worktree = {
        body = ''
          git_is_repo
          and test (command git rev-parse --is-inside-git-dir) = false
        '';
      };

      git_untracked = {
        body = ''
          git_is_worktree; and begin
            command git ls-files --other --exclude-standard
          end
        '';
      };

    };

    interactiveShellInit = ''
      function git_ahead -a ahead behind diverged none
        not git_is_repo; and return

        set -l commit_count (command git rev-list --count --left-right "@{upstream}...HEAD" 2> /dev/null)

        switch "$commit_count"
        case ""
          # no upstream
        case "0"\t"0"
          test -n "$none"; and echo "$none"; or echo ""
        case "*"\t"0"
          test -n "$behind"; and echo "$behind"; or echo "-"
        case "0"\t"*"
          test -n "$ahead"; and echo "$ahead"; or echo "+"
        case "*"
          test -n "$diverged"; and echo "$diverged"; or echo "±"
        end
      end
    '';
  };
}
