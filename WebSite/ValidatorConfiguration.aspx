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
        <div id="rule1" class="k-editor">
            <div class="k-editor-header">
                <div>
                    Regola 1<input type="text" class="editor-field rule-description k-textbox" data-rule-name="rule1" placeholder="Descrizione" data-bind="value: ruleDescription"/>
                    Tripletta associata: <div class="flow-association" data-rule-name="rule1" data-role="dropdownlist" data-option-label="Seleziona tripletta" data-option-label-template="optionLabelTemplate" data-value-template="flowAssociationTemplate" data-template="flowAssociationTemplate" data-text-field="name" data-value-field="value" data-bind="value: associatedFlow, source: flowIdentificators"></div>
                </div>
                <a href="#" class="k-primary configurator-add-rulegroup" data-rule-name="rule1" data-last-editor-id="1" data-role="button" data-icon="add" data-bind="click: addRuleGroup">Aggiungi gruppo</a>
                <a href="#" class="k-primary configurator-save-rule" data-rule-name="rule1" data-bind="enabled: canSave('rule')">Salva regola</a>
                <input type="hidden" class="rule-json" data-rule-name="rule1" />
                
                <div>
                    Definizione Regola:<span class="rule-definition" data-rule-name="rule1" data-bind="attr: { id: ruleDefId }"></span>
                </div>
            </div>
            <div class="k-editor-content">
                <div class="editor-rule-group" id="editor-1"  data-rule-name="rule1">
                    <p class="editor-field rule-group-name" data-editor="editor-1">Gruppo 1</p>
                    <div class="editor-field" data-bind="visible: fieldNames.length > 1">
                        <div class="logicOperatorDropdownlist" data-editor="editor-1" data-role="dropdownlist" data-option-label="Seleziona opzione" data-text-field="name" data-value-field="value" data-value-primitive="true" data-bind="value: operator, source: operatorDataSource"></div> condizione.
                    </div>
                    <div class="editor-field">
                        <div class="fieldSelectionDropdownlist" data-editor="editor-1" data-role="dropdownlist" data-option-label="Seleziona opzione" data-text-field="name" data-value-field="value" data-value-primitive="true" data-bind="value: field1, source: fieldDataSource"></div> è valorizzato.
                        <span class="k-icon k-i-add editor-plus-sign" data-editor="editor-1" title="Aggiungi campo obbligatorio" data-bind="click: addField"></span>
                    </div>
                    <div class="editor-field">
                        <a href="#" class="k-primary editor-save-button" data-rule-name="rule1" data-editor="editor-1" data-role="button" data-bind="enabled: canSave('fieldGroup'), click:saveFieldGroup">Salva</a>
                    </div>
                </div>
            </div>
        </div>
    </form>
</body>
</html>
