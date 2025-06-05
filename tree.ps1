function Get-Tree {
    param (
        [string]$Path = '.',
        [array]$Exclude = @()
    )

    $indent = "  " # Two spaces for indentation

    function Recurse-Tree {
        param (
            [string]$CurrentPath,
            [int]$Level
        )

        Get-ChildItem -Path $CurrentPath -Exclude $Exclude | ForEach-Object {
            $prefix = $indent * $Level
            if ($_.PSIsContainer) {
                Write-Host "$($prefix)📂 $($_.Name)"
                Recurse-Tree -CurrentPath $_.FullName -Level ($Level + 1)
            } else {
                Write-Host "$($prefix)📄 $($_.Name)"
            }
        }
    }

    $rootName = (Get-Item $Path).Name
    Write-Host "C:\Users\Resident\dev\To-Colemak\$rootName" # Customize this for your root
    Recurse-Tree -CurrentPath $Path -Level 0
}

# Example usage:
Get-Tree -Exclude "node_modules", "cache", ".git"