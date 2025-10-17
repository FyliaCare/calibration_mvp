# PowerShell script to rebrand all text references

Write-Host "🎨 Rebranding to CalPro..." -ForegroundColor Cyan

$files = @('public\index.html', 'public\app.js')

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "📝 $file..." -ForegroundColor Yellow
        $content = Get-Content $file -Raw
        
        $content = $content -replace 'INTERTEK GHANA LIMITED', 'CALPRO CALIBRATION SERVICES'
        $content = $content -replace 'INTERTEK CALIBRATION SERVICES', 'CALPRO CALIBRATION SERVICES'
        $content = $content -replace 'INTERTEK', 'CALPRO'
        $content = $content -replace 'Intertek Ghana Limited', 'CalPro Calibration Services'
        $content = $content -replace 'Intertek Calibration Services', 'CalPro Calibration Services'
        $content = $content -replace 'Intertek', 'CalPro'
        $content = $content -replace 'E\. Mensah', 'John Doe'
        $content = $content -replace 'emensah@intertek\.com', 'admin@calpro.com'
        $content = $content -replace 'I\. Aggrey', 'Jane Smith'
        $content = $content -replace 'G\. Dinkelman', 'Robert Johnson'
        
        $content | Set-Content $file -NoNewline
        Write-Host "   ✅ Updated" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "✅ Complete!" -ForegroundColor Green
