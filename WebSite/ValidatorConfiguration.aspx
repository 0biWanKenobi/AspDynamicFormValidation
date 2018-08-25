<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ValidatorConfiguration.aspx.cs" Inherits="WebSite.ValidatorConfiguration" %>
<%@ Import Namespace="System.Web.Optimization" %>
<%@ Register src="~/ValidatorConfigurationTemplate.ascx" tagPrefix="kendo" tagName="editorTemplates" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Validation Configurator</title>
    <asp:PlaceHolder runat="server">   
        <%: Scripts.Render("~/bundle/js")     %>
        <%: Styles.Render("~/Styles/Kendo/css")%>
        <%: Scripts.Render("~/bundle/kendoJs")%>
    </asp:PlaceHolder>
    <link href="~/Styles/validationConfigurator.css" rel="stylesheet"/>
    <script src="<%: ResolveUrl("~/Scripts/FormValidation/configurationBuilding.js") %>"></script>
    <script src="<%: ResolveUrl("~/Scripts/FormValidation/configurationLoading.js") %>"></script>

</head>
<body>
    <kendo:editorTemplates runat="server"/>
    
    <form id="configurationLoaderForm">
        <div id="configurator-macrotype" class="margin-10" data-role="dropdownlist" data-option-label="Seleziona macrotipo"    data-text-field="macrotype" data-value-field="macrotype" data-bind="source:availableTipologies.macrotypeDatasource, value: tipology.chosenMacrotype"></div>
        <div id="configurator-type-one"  class="margin-10" data-role="dropdownlist" data-option-label="Seleziona tipologia 1"  data-text-field="tipology" data-value-field="tipology" data-bind="source:availableTipologies.tipologyDatasource , value: tipology.chosenTypeOne " data-cascade-from="configurator-macrotype"></div>
        <div id="configurator-type-two"  class="margin-10" data-role="dropdownlist" data-option-label="Seleziona tipologia 2"  data-text-field="subtype" data-value-field="subtype" data-bind="source:availableTipologies.subtypeDatasource  , value: tipology.chosenTypeTwo " data-cascade-from="configurator-type-one"></div>
        <span data-bind="attr: {title: saveButtonTitle}">
            <a href="#" data-role="button" data-icon="preview" class="k-primary configuration-load-button" data-bind="enabled:canLoad, click: loadConfiguration">Visualizza Formula</a>
        </span>

        <a href="#" data-role="button" data-icon="add" class="configuration-new-button" data-bind="invisible: isConfigurationLoaded, click: newFormula">Nuova Formula</a>
    </form>

    <form id="configuratorForm">
        <div id="formula-container"></div>
        <div id="formula-rules"></div>
    </form>
</body>
</html>
