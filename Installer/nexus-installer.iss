; NEXUS Market AI — Instalador Profissional
; Requer Inno Setup (https://jrsoftware.org/isdl.php)
; Para compilar: Inno Setup Compiler > Abrir este arquivo > Compile

#define MyAppName "NEXUS Market AI"
#define MyAppVersion "4.0.0"
#define MyAppPublisher "NEXUS Tecnologia"
#define MyAppURL "https://nexus.ai"
#define MyAppExeName "start-nexus.bat"

[Setup]
AppId={{B8F9A3D1-5E2C-4A7B-9D6F-1C3E8A2B5D7F}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
DefaultDirName=C:\NEXUS_Market_AI
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=yes
OutputDir=.\output
OutputBaseFilename=nexus-market-ai-setup-{#MyAppVersion}
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=admin
DisableWelcomePage=no
SetupIconFile=..\frontend\public\favicon.ico
UninstallDisplayIcon={app}\frontend\public\favicon.ico
UninstallDisplayName={#MyAppName}

[Languages]
Name: "portuguese"; MessagesFile: "compiler:Languages\BrazilianPortuguese.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "Criar atalho na Area de Trabalho"; GroupDescription: "Atalhos:"; Flags: checkedonce
Name: "quicklaunchicon"; Description: "Criar atalho na barra de inicializacao rapida"; GroupDescription: "Atalhos:"; Flags: checkedonce; OnlyBelowVersion: 6.1; Check: not IsAdminInstallMode

[Files]
Source: "..\backend\*"; DestDir: "{app}\backend"; Flags: ignoreversion recursesubdirs createallsubdirs; Excludes: "node_modules,node_modules\*"
Source: "..\frontend\*"; DestDir: "{app}\frontend"; Flags: ignoreversion recursesubdirs createallsubdirs; Excludes: "node_modules,node_modules\*"
Source: "..\docker-compose.yml"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\deploy\*"; DestDir: "{app}\deploy"; Flags: ignoreversion recursesubdirs createallsubdirs; Excludes: "node_modules,node_modules\*"
Source: "..\INSTALL.md"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\README.md"; DestDir: "{app}"; Flags: ignoreversion
Source: "start-nexus.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "stop-nexus.bat"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\start-nexus.bat"; WorkingDir: "{app}"; IconFilename: "{app}\frontend\public\favicon.ico"; Comment: "Iniciar NEXUS Market AI"
Name: "{group}\Desinstalar {#MyAppName}"; Filename: "{uninstallexe}"; IconFilename: "{app}\frontend\public\favicon.ico"
Name: "{commondesktop}\{#MyAppName}"; Filename: "{app}\start-nexus.bat"; WorkingDir: "{app}"; IconFilename: "{app}\frontend\public\favicon.ico"; Tasks: desktopicon; Comment: "Iniciar NEXUS Market AI"
Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\{#MyAppName}"; Filename: "{app}\start-nexus.bat"; WorkingDir: "{app}"; IconFilename: "{app}\frontend\public\favicon.ico"; Tasks: quicklaunchicon

[Run]
Filename: "{app}\start-nexus.bat"; Description: "Iniciar NEXUS Market AI agora"; Flags: nowait skipifsilent shellexec
Filename: "http://localhost:3000"; Description: "Abrir NEXUS Market AI"; Flags: skipifsilent shellexec

[UninstallRun]
Filename: "{app}\stop-nexus.bat"; Flags: runhidden

[Code]
function InitializeSetup: Boolean;
begin
  Result := True;
end;

procedure CurStepChanged(CurStep: TSetupStep);
var
  ResultCode: Integer;
begin
  if CurStep = ssPostInstall then
  begin
    if MsgBox('Deseja configurar o banco de dados agora? (PostgreSQL necessario)', mbConfirmation, MB_YESNO) = IDYES then
    begin
      Exec(ExpandConstant('{cmd}'), '/c cd /d "' + ExpandConstant('{app}') + '\backend" & npm run migrate & npm run seed', '', SW_SHOW, ewWaitUntilTerminated, ResultCode);
    end;
  end;
end;
