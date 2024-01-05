export function isMobileViewHook(setIsMobile, width) {
  window.addEventListener("load", () => {
    getWidthAndDecideScreen(setIsMobile, width);
  });
  window.addEventListener("resize", () => {
    getWidthAndDecideScreen(setIsMobile, width);
  });
  getWidthAndDecideScreen(setIsMobile, width);
}

function getWidthAndDecideScreen(setIsMobile, width = 992) {
  if (window.screen.width < width || window.innerWidth < width) {
    setIsMobile(true);
  } else {
    setIsMobile(false);
  }
}
