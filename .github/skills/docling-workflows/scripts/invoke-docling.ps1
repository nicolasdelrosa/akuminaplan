param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$DoclingArgs
)

if (-not $DoclingArgs -or $DoclingArgs.Count -eq 0) {
    throw "Pass Docling CLI arguments, for example: .\\scripts\\invoke-docling.ps1 .\\input.pdf --to md --output .\\docling-output"
}

$docling = Get-Command docling -ErrorAction SilentlyContinue
if ($docling) {
    & $docling.Source @DoclingArgs
    exit $LASTEXITCODE
}

$uvx = Get-Command uvx -ErrorAction SilentlyContinue
if ($uvx) {
    & $uvx.Source "--from=docling" "docling" @DoclingArgs
    exit $LASTEXITCODE
}

throw "Docling CLI was not found. Install Docling first, or install uv so this wrapper can fall back to 'uvx --from=docling docling'."
