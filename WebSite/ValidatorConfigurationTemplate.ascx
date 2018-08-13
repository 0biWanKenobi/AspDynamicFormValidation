<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="ValidatorConfigurationTemplate.ascx.cs" Inherits="WebSite.ValidatorConfigurationTemplate" %>
<script type="kendo/html" id="ruleGroupTemplate">
    <div class="editor-rule-group" id="editor-#=editorId#" data-rule-name="#=ruleId#">   
        <p class="editor-field rule-group-name" data-editor="editor-#=editorId#">Gruppo #=editorId#</p>
        <input class="editor-rule" type="hidden" data-editor="editor-#=editorId#"/>
        <div class="editor-field">
            <div class="logicOperatorDropdownlist" data-editor="editor-#=editorId#"></div> condizione.
        </div>
        <div class="editor-field">
            <div class="fieldSelectionDropdownlist" data-editor="editor-#=editorId#"></div> è valorizzato.
            <span class="k-icon k-i-plus editor-plus-sign" data-editor="editor-#=editorId#"></span>
        </div>
        <div class="editor-field">
            <a href="\\#" class="k-primary editor-save-button" data-rule-name="#=ruleId#" data-editor="editor-#=editorId#">Salva</a>
        </div>
    </div>
</script>

<script type="kendo/html" id="ruleDefinitionTemplate">
    <span class="ruleSegment" data-editor="#=editorId#">
        <div class="#=dropDownClass#" data-dropdown-sequence="#=editorId#"></div>  
        <span class="rule-group-name" data-editor="#=editorId#">#=groupName#</span>              
    </span>
</script>

<script type="kendo/html" id="flowAssociationTemplate">
    <span class="#=value=='' ? 'k-state-disabled': ''#" title="#=title#">#=name#</span>
</script>

