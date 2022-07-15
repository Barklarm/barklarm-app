$ErrorActionPreference = 'Stop';
$packageArgs = @{
  packageName    = 'Barklarm'
  installerType  = 'exe'
  url            = 'https://github.com/kanekotic/barklarm/releases/download/__REPLACE_VERSION__/barklarm-__REPLACE_VERSION__.Setup.exe'
  checksum       = '__REPLACE_CHECKSUM__'
  checksumType   = 'md5'
  silentArgs     = '/S'
  validExitCodes = @(0)
  softwareName   = 'Barklarm'
}
Install-ChocolateyPackage @packageArgs