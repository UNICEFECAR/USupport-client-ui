// Set while the app reloads itself (e.g. to load a newly deployed version),
// so the logout on leaving the page can tell this apart from the user closing it
let isReloadingApp = false;

export const isAppReloading = () => isReloadingApp;

export const reloadApp = () => {
  isReloadingApp = true;
  window.location.reload();
};
