@echo off
setlocal
title VotaBrasil - Fusao Total (v17) + LOG
set "LOG=%~dp0LOG-FUSAO-TOTAL.txt"
call :MAIN > "%LOG%" 2>&1
type "%LOG%"
echo.
pause
exit /b 0

:MAIN
echo VotaBrasil - Fusao Total v17 (traz TUDO do mudabrasilv4)
cd /d "%~dp0..\votabrasil" || goto ERR
echo [1/6] Conectando remote mbv4 ...
git remote get-url mbv4 >nul 2>&1 || git remote add mbv4 https://github.com/xbrancox/mudabrasilv4.git
echo [2/6] Baixando main do mudabrasilv4 ...
git fetch mbv4 main || goto ERR
echo [3/6] Merge com prioridade total para as melhorias de la ...
set "PUSHF="
git merge mbv4/main -X theirs --allow-unrelated-histories -m "feat: fusao total - todas as melhorias do mudabrasilv4" >nul 2>&1
if errorlevel 1 (
  echo   conflitos residuais - adotando a arvore integral deles ...
  git merge --abort >nul 2>&1
  git checkout -B main mbv4/main || goto ERR
  set "PUSHF=-f"
)
echo [4/6] Garantindo os 5 modulos na raiz ...
for %%f in (pdf-cassacao.js notificacoes-pwa.js dashboard-politico.js gamificacao.js api-publica.js) do (
  if not exist "%%f" if exist "MudaBrasil\%%f" copy /Y "MudaBrasil\%%f" "." >nul
  if not exist "%%f" curl -s -f -o "%%f" "https://xbrancox.github.io/mudabrasilv4/%%f" || curl -s -f -o "%%f" "https://xbrancox.github.io/mudabrasilv4/MudaBrasil/%%f"
)
echo [5/6] Alias de marca no config.js (idempotente) ...
powershell -NoProfile -Command "$p='config.js';if(Test-Path $p){$c=[IO.File]::ReadAllText($p);if($c -notmatch 'VotaBrasil=window.VotaBrasil'){$c=$c+[char]10+'window.VotaBrasil=window.VotaBrasil||window.MudaBrasil||{};'+[char]10+'window.MudaBrasil=window.MudaBrasil||window.VotaBrasil;';[IO.File]::WriteAllText($p,$c);'PATCH-OK'}else{'JA-PATCHED'}}else{'SEM-CONFIG'}"
echo [6/6] Commit + push ...
git add -A
git commit -q -m "feat: votabrasil = mudabrasilv4 + modulos (fusao total v17)" || echo   nada novo para commitar
git push %PUSHF% origin main || goto ERR
echo CONCLUIDO. Actions deploya em ~1 min: https://xbrancox.github.io/votabrasil/
exit /b 0

:ERR
echo ERRO - a janela fica aberta; mande LOG-FUSAO-TOTAL.txt
exit /b 1