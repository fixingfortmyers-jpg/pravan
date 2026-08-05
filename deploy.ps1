# Pravan deploy: build -> push source to master -> publish dist to gh-pages -> configure Pages.
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

npm run build
if ($LASTEXITCODE -ne 0) { throw "build failed" }

git add -A
git -c user.name=Tony -c user.email=prudhvi.pallempati@gmail.com commit -m "Site build" --allow-empty | Out-Null
git push -u origin master

# gh-pages is a throwaway orphan branch rebuilt from dist every deploy.
Push-Location dist
if (Test-Path .git) { Remove-Item -Recurse -Force .git }
git init -b gh-pages | Out-Null
git add -A
git -c user.name=Tony -c user.email=prudhvi.pallempati@gmail.com commit -m "Deploy" | Out-Null
git push -f https://github.com/fixingfortmyers-jpg/pravan.git gh-pages
Remove-Item -Recurse -Force .git
Pop-Location

try {
  gh api -X POST repos/fixingfortmyers-jpg/pravan/pages -f "source[branch]=gh-pages" -f "source[path]=/" 2>$null | Out-Null
  "Pages enabled"
} catch { "Pages already enabled (or POST rejected) - continuing" }
try {
  gh api -X PUT repos/fixingfortmyers-jpg/pravan/pages -f cname=pravan.fixingfortmyers.com 2>$null | Out-Null
  "Custom domain set"
} catch { "Custom domain call failed - CNAME file in branch should still apply" }

gh api repos/fixingfortmyers-jpg/pravan/pages --jq '{status: .status, cname: .cname, https: .https_enforced, url: .html_url}'
