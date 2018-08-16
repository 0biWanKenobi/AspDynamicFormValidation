<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="ValidatorConfigurationTemplate.ascx.cs" Inherits="WebSite.ValidatorConfigurationTemplate" %>
<script type="kendo/html" id="ruleGroupTemplate">
    <div class="editor-rule-group" id="editor-#=editorId#" data-rule-name="#=ruleId#">   
        <p class="editor-field rule-group-name" data-editor="editor-#=editorId#">Gruppo #=editorId#</p>        
        <div class="editor-field" data-bind="visible: fieldNames.length > 1">
            <div class="logicOperatorDropdownlist" data-editor="editor-#=editorId#" data-role="dropdownlist" data-option-label="Seleziona opzione" data-text-field="name" data-value-field="value" data-value-primitive="true" data-bind="value: operator, source: operatorDataSource"></div> condizione.
        </div>
        <div class="editor-field">
            <div class="fieldSelectionDropdownlist" data-editor="#=editorId#" data-role="dropdownlist" data-option-label="Seleziona opzione" data-text-field="name" data-value-field="value" data-value-primitive="true" data-bind="value: #=fieldName#, source: fieldDataSource"></div> è valorizzato.
            <span class="k-icon k-i-add editor-plus-sign" data-editor="editor-#=editorId#" title="Aggiungi campo obbligatorio" data-bind="click: addField"></span>
        </div>
        <div class="editor-field">
            <a href="\\#" class="k-primary editor-save-button" data-rule-name="#=ruleId#" data-editor="editor-#=editorId#"  data-role="button" data-bind="click:saveFieldGroup, enabled: canSave('fieldGroup')">Salva</a>
        </div>
    </div>
</script>

<script type="kendo/html" id="ruleDefinitionTemplate">
    <span class="ruleSegment" data-editor="#=editorId#"> 
        # if(data.useDropDown) { #
        <div id="#=ruleId+'-'+editorId #" data-bind="attr: {class: cssClass}" style="display:inline-block">
            <div style="width:100%" class="ruleOperatorDropDownlist" data-role="dropdownlist" data-dropdown-sequence="#=editorId#"  data-text-field="name" data-value-field="value" data-value-primitive="true" data-bind="value: selectedOption, source: logicalRuleOperators"></div> 
        </div>
        # } #
        <span class="rule-group-name" data-editor="#=editorId#">#=groupName#</span>              
    </span>
</script>



<script type="kendo/html" id="flowAssociationTemplate">
    <span class="#=value=='' ? 'k-state-disabled': ''#" title="#=title#">#=name#</span>
</script>

<script type="kendo/html" id="optionLabelTemplate">#=data#</script>

<script type="kendo/html" id="fieldTemplate">
    <div class="editor-field">
        <div class="fieldSelectionDropdownlist" data-editor="#=editorId#" data-role="dropdownlist" data-option-label="Seleziona opzione" data-text-field="name" data-value-field="value" data-value-primitive="true" data-bind="value: #=fieldName#, source: fieldDataSource"></div> è valorizzato.
    </div>
</script>


