sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast"
], function(Controller, MessageToast) {
  "use strict";
  return Controller.extend("my.openui5.mwe.controller.Main", {
    onGreet: function() {
      var oView = this.getView();
      var sName = oView.byId("nameInput").getValue();
      if (sName) {
        MessageToast.show("Hi " + sName + "!");
      } else {
        MessageToast.show("Please enter your name.");
      }
    }
  });
}); 