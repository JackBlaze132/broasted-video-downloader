import electronUpdater from 'electron-updater';
const { autoUpdater } = electronUpdater;
import { dialog } from 'electron';

export function setupUpdater() {
  // We want to manually control the download and installation to make it optional
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('update-available', (info) => {
    // We could notify here, but electron-updater autoDownload=true will start downloading
    console.log('Update available, downloading...', info);
  });

  autoUpdater.on('update-downloaded', async (info) => {
    const { response } = await dialog.showMessageBox({
      type: 'info',
      buttons: ['Restart and Install', 'Later'],
      title: 'Application Update',
      message: `A new version (${info.version}) is available.`,
      detail: 'The update has been downloaded. Would you like to restart the application to install it now?',
      defaultId: 0,
      cancelId: 1
    });

    if (response === 0) {
      // Call quitAndInstall to apply the update
      autoUpdater.quitAndInstall();
    }
  });

  autoUpdater.on('error', (err) => {
    console.error('Error in auto-updater: ', err);
  });

  // Check for updates
  autoUpdater.checkForUpdates().catch(err => {
    console.error('Failed to check for updates', err);
  });
}
