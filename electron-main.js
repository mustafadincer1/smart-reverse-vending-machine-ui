const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

// Windows için AppUserModelID ayarı (bildirim ve kısayol simgesi için)
if (process.platform === 'win32') {
    app.setAppUserModelId('com.yourcompany.kioskapp');
}

// Uygulamanın tekil instance olarak çalışmasını sağlar
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        // İkinci instance açılmaya çalıştığında varolan pencereyi öne getir
        const [win] = BrowserWindow.getAllWindows();
        if (win) {
            if (win.isMinimized()) win.restore();
            win.focus();
        }
    });

    function createWindow() {
        const mainWindow = new BrowserWindow({
            width: 1280,
            height: 800,
            frame: false,           // Başlık çubuğunu tamamen kaldırır
            fullscreen: true,       // Tam ekran açılır
            kiosk: true,            // Kiosk modu: ESC ile çıkışı engeller
            autoHideMenuBar: true,  // Menü çubuğunu gizler
            resizable: false,       // Boyutlandırılamaz
            movable: false,         // Taşınamaz
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });

        const startUrl = url.format({
            pathname: path.join(__dirname, "build", "index.html"),
            protocol: "file:",
            slashes: true
        });
        mainWindow.loadURL(startUrl);

        // Sadece geliştirme ortamındayken DevTools açılsın
        //if (process.env.NODE_ENV !== 'production') {
        //    mainWindow.webContents.openDevTools();
        //}
    }

    app.whenReady().then(createWindow);

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });
}
