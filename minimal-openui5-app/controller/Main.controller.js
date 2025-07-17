sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function(Controller, MessageToast) {
    "use strict";
    return Controller.extend("app.controller.Main", {
        onPress: function() {
            MessageToast.show("Button was pressed!");
        }
    });
}); 