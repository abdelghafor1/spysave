param(
  [ValidateSet("chrome", "edge", "firefox", "all")]
  [string]$Target = "all"
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$extensionDir = Join-Path $root "extension"
$distDir = Join-Path $root "dist\extensions"
$version = (Get-Content (Join-Path $extensionDir "manifest.json") | ConvertFrom-Json).version

$targets = if ($Target -eq "all") { @("chrome", "edge", "firefox") } else { @($Target) }

New-Item -ItemType Directory -Force -Path $distDir | Out-Null

foreach ($item in $targets) {
  $workDir = Join-Path $distDir "spysave-$item"
  $zipPath = Join-Path $distDir "spysave-$item-$version.zip"

  if (Test-Path $workDir) {
    Remove-Item -LiteralPath $workDir -Recurse -Force
  }
  if (Test-Path $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
  }

  New-Item -ItemType Directory -Force -Path $workDir | Out-Null
  Copy-Item -LiteralPath (Join-Path $extensionDir "icons") -Destination $workDir -Recurse

  $files = @(
    "background.js",
    "content.js",
    "popup.css",
    "popup.html",
    "popup.js",
    "site-bridge.js"
  )

  foreach ($file in $files) {
    Copy-Item -LiteralPath (Join-Path $extensionDir $file) -Destination $workDir
  }

  $manifestSource = switch ($item) {
    "edge" { "manifest.edge.json" }
    "firefox" { "manifest.firefox.json" }
    default { "manifest.json" }
  }

  Copy-Item -LiteralPath (Join-Path $extensionDir $manifestSource) -Destination (Join-Path $workDir "manifest.json")
  Compress-Archive -Path (Join-Path $workDir "*") -DestinationPath $zipPath -Force
  Write-Host "Built $zipPath"
}
