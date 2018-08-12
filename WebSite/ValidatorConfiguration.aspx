<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ValidatorConfiguration.aspx.cs" Inherits="WebSite.ValidatorConfiguration" %>
<%@ Import Namespace="System.Web.Optimization" %>
<%@ Register src="~/ValidatorConfigurationTemplate.ascx" tagPrefix="kendo" tagName="editorTemplate" %>

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
    <script src="<%: ResolveUrl("~/Scripts/FormValidation/main.js") %>"></script>

</head>
<body>
    <kendo:editorTemplate runat="server"/>
    <form id="configuratorForm">
        <a href="#" class="k-primary configurator-add-rulegroup" data-rule-name="1" data-last-editor-id="1">Aggiungi gruppo</a>
        <a href="#" class="k-primary configurator-save-rule" data-rule-name="1">Salva regola</a>
        <div class="k-editor">
            Regola 1<input type="text" class="editor-field rule-description" data-rule-name="1" placeholder="Descrizione"/>
            
            <div>
                Definizione Regola:<span class="rule-definition" data-rule-name="1"></span>
            </div>
            
            <div class="editor-rule-group" id="editor-1"  data-rule-name="1">
                <p class="editor-field rule-group-name" data-editor="editor-1">Gruppo 1</p>
                <input class="editor-rule" type="hidden" data-editor="editor-1"/>
                <div class="editor-field">
                    <div class="logicOperatorDropdownlist"></div> condizione.
                </div>
                <div class="editor-field">
                    <div class="fieldSelectionDropdownlist" data-editor="editor-1"></div> è valorizzato.
                    <span class="k-icon k-i-plus editor-plus-sign" data-editor="editor-1" title="Aggiungi campo obbligatorio"></span>
                </div>
                <div class="editor-field">
                    <a href="#" class="k-primary editor-save-button" data-rule-name="1" data-editor="editor-1">Salva</a>
                </div>
            </div>
        </div>
       
    </form>
</body>
</html>
