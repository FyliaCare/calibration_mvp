# PowerShell script to rebrand all text references from Intertek to CalPro

Write-Host "🎨 Rebranding text references to CalPro..." -ForegroundColor Cyan
Write-Host ""

$replacements = @{
    'INTERTEK' = 'CALPRO'
    'Intertek' = 'CalPro'
    'intertek' = 'calpro'
    'INTERTEK CALIBRATION SERVICES' = 'CALPRO CALIBRATION SERVICES'
    'Intertek Calibration Services' = 'CalPro Calibration Services'
    'INTERTEK GHANA LIMITED' = 'CALPRO CALIBRATION SERVICES'
    'Intertek Ghana Limited' = 'CalPro Calibration Services'
    'E\. Mensah' = 'John Doe'
    'emensah' = 'admin'
    'emensah@intertek\.com' = 'admin@calpro.com'
    'admin@intertek\.com' = 'admin@calpro.com'
    'I\. Aggrey' = 'Jane Smith'
    'G\. Dinkelman' = 'Robert Johnson'
}

$files = @(
    'public\index.html',
    'public\app.js',
    'public\profile.html'
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "📝 Processing $file..." -ForegroundColor Yellow
        
        $content = Get-Content $file -Raw
        $modified = $false
        
        foreach ($old in $replacements.Keys) {
            $new = $replacements[$old]
            if ($content -match $old) {
                $content = $content -replace $old, $new
                $modified = $true
            }
        }
        
        if ($modified) {
            $content | Set-Content $file -NoNewline
            Write-Host "   ✅ Updated $file" -ForegroundColor Green
        } else {
            Write-Host "   ⏭️  No changes needed in $file" -ForegroundColor Gray
        }
    } else {
        Write-Host "   ⚠️  File not found: $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ Text rebranding complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary of changes:" -ForegroundColor Cyan
Write-Host "   • Company: INTERTEK → CALPRO" -ForegroundColor White
Write-Host "   • Admin User: E. Mensah → John Doe" -ForegroundColor White
Write-Host "   • Email: emensah@intertek.com → admin@calpro.com" -ForegroundColor White
Write-Host "   • Technicians: Generic names (Jane Smith, Robert Johnson)" -ForegroundColor White
Write-Host ""
