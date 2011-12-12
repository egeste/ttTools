ttTools.notifications = {
  
  init : function () {
    window.webkitNotifications.requestPermission(this.initAfterRequest);
  },

  initAfterRequest : function () {
    if (!this.isPermitted) { return; }
    
  },

  isSupported : function () {
    return window.webkitNotifications ? true : false;
  },

  isPermitted : function () {
    return window.webkitNotifications.checkPermission() == 0 ? true : false
  }
}
