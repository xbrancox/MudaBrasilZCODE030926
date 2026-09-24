@echo off
setlocal
title VotaBrasil - Home na raiz (v13) + LOG
cd /d "%~dp0..\votabrasil" || goto ERR
set "LOG=%~dp0LOG-HOME-RAIZ.txt"
call :MAIN > "%LOG%" 2>&1
type "%LOG%"
echo.
pause
exit /b 0

:MAIN
echo [1/4] Baixando mudabrasilv4 so para copiar a home ...
if exist _tmp_mb rd /s /q _tmp_mb
git clone --depth 1 https://github.com/xbrancox/mudabrasilv4 _tmp_mb || goto ERR
echo [2/4] Copiando home + 11 modulos para a raiz (SEM tocar no app/ bom) ...
robocopy "_tmp_mb\MudaBrasil" "." /E /XD app .git _tmp_mb /NFL /NDL /NJH /NJS
if errorlevel 8 goto ERR
rd /s /q _tmp_mb
echo [3/4] Commit + push ...
git add -A
git commit -q -m "feat: home VotaBrasil + 11 modulos na raiz (consolidacao final)"
git push origin main || goto ERR
echo [4/4] OK. O Actions deploya sozinho em ~1 min.
echo Confira: https://xbrancox.github.io/votabrasil/
exit /b 0

:ERR
echo ERRO nesta etapa - janela fica aberta, me mande o LOG-HOME-RAIZ.txt
exit /b 1