# Script de copy tat ca reference addons vao Minecraft Preview
# Usage: .\deploy-reference-addons.ps1

param(
    [Parameter(Mandatory=$false)]
    [switch]$Clear
)

# Paths
$MinecraftPreviewPath = "$env:LOCALAPPDATA\..\Roaming\Minecraft Bedrock Preview\Users\Shared\games\com.mojang"
$BehaviorPacksPath = "$MinecraftPreviewPath\development_behavior_packs"
$ResourcePacksPath = "$MinecraftPreviewPath\development_resource_packs"
$ReferencePath = "C:\Users\tomis\Docs\APEIRIX\reference_addons"

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Clear-ReferenceAddons {
    Write-ColorOutput "`nClearing all reference addons..." "Yellow"
    
    $bpFolders = Get-ChildItem -Path $BehaviorPacksPath -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -like "*_REF_BP" }
    $rpFolders = Get-ChildItem -Path $ResourcePacksPath -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -like "*_REF_RP" }
    
    foreach ($folder in $bpFolders) {
        Remove-Item -Path $folder.FullName -Recurse -Force
        Write-ColorOutput "  Removed $($folder.Name)" "Green"
    }
    
    foreach ($folder in $rpFolders) {
        Remove-Item -Path $folder.FullName -Recurse -Force
        Write-ColorOutput "  Removed $($folder.Name)" "Green"
    }
    
    Write-ColorOutput "`nAll reference addons cleared!" "Green"
    Write-ColorOutput "Run /reload in Minecraft to apply changes`n" "Cyan"
}

function Copy-ReferenceAddons {
    Write-ColorOutput "`n========================================" "Magenta"
    Write-ColorOutput "   Deploy Reference Addons" "Magenta"
    Write-ColorOutput "========================================" "Magenta"
    
    Write-ColorOutput "`nScanning for addons in: $ReferencePath" "Yellow"
    
    if (-not (Test-Path $ReferencePath)) {
        Write-ColorOutput "ERROR: Reference path not found: $ReferencePath" "Red"
        return
    }
    
    if (-not (Test-Path $BehaviorPacksPath)) {
        New-Item -ItemType Directory -Path $BehaviorPacksPath -Force | Out-Null
    }
    
    if (-not (Test-Path $ResourcePacksPath)) {
        New-Item -ItemType Directory -Path $ResourcePacksPath -Force | Out-Null
    }
    
    $copiedCount = 0
    
    # Find all manifest.json files
    Get-ChildItem -Path $ReferencePath -Filter "manifest.json" -Recurse -Depth 3 | ForEach-Object {
        $manifestPath = $_.FullName
        $addonFolder = $_.Directory
        
        try {
            $manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
            $addonName = $addonFolder.Parent.Name
            
            # Check if it's a behavior pack
            $isBP = $manifest.modules | Where-Object { $_.type -eq "data" -or $_.type -eq "script" }
            $isRP = $manifest.modules | Where-Object { $_.type -eq "resources" }
            
            if ($isBP) {
                $targetName = "$($addonName)_REF_BP"
                $targetPath = Join-Path $BehaviorPacksPath $targetName
                
                if (Test-Path $targetPath) {
                    Remove-Item -Path $targetPath -Recurse -Force
                }
                
                Copy-Item -Path $addonFolder.FullName -Destination $targetPath -Recurse -Force
                Write-ColorOutput "  [BP] $($addonFolder.Name) -> $targetName" "Green"
                $copiedCount++
            }
            elseif ($isRP) {
                $targetName = "$($addonName)_REF_RP"
                $targetPath = Join-Path $ResourcePacksPath $targetName
                
                if (Test-Path $targetPath) {
                    Remove-Item -Path $targetPath -Recurse -Force
                }
                
                Copy-Item -Path $addonFolder.FullName -Destination $targetPath -Recurse -Force
                Write-ColorOutput "  [RP] $($addonFolder.Name) -> $targetName" "Green"
                $copiedCount++
            }
        }
        catch {
            Write-ColorOutput "  ERROR: Failed to process $manifestPath" "Red"
        }
    }
    
    Write-ColorOutput "`nDeployed $copiedCount addon packs!" "Green"
    Write-ColorOutput "`nNext steps:" "Cyan"
    Write-ColorOutput "  1. Open Minecraft Preview" "White"
    Write-ColorOutput "  2. Create a new world" "White"
    Write-ColorOutput "  3. Enable the addons you want to test" "White"
    Write-ColorOutput "  4. Run /reload in game`n" "White"
    
    Write-ColorOutput "Tip: All reference addons are named with '_REF_BP' or '_REF_RP' suffix" "Gray"
    Write-ColorOutput "To clear: .\deploy-reference-addons.ps1 -Clear`n" "Gray"
}

# Main execution
if ($Clear) {
    Clear-ReferenceAddons
}
else {
    Copy-ReferenceAddons
}
