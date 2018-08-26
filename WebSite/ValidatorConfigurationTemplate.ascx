<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="ValidatorConfigurationTemplate.ascx.cs" Inherits="WebSite.ValidatorConfigurationTemplate" %>

<%--
    --------------------------------
    CONFIGURATION BUILDING TEMPLATES
    --------------------------------
--%>


<script type="kendo/html" id="formulaTemplate">
    <div class="rounded-border margin-10 padding-10 configuration-formula">
        <span>Formula&nbsp;</span>
        <input type="text" class="formula-description k-textbox" placeholder="Descrizione formula" data-bind="value: description"/>
        <a href="\\#" class="k-primary margin-10 configuration-save-button" data-role="button" data-icon="save" data-bind="enabled: saveEnabled, click: saveFormula">Salva Formula</a>
        <a href="\\#" class="margin-10 rule-new-button" data-role="button" data-icon="add" data-bind="click: newRule">Aggiungi Regola</a>
        <div class="formula-tipologies"></div>
        <div class="margin-topbottom-10">
            <span>Definizione&nbsp;</span>
            <span class="configuration-formula-definition"></span>
        </div>        
    </div>
</script>

<script type="kendo/html" id="formulaTipologyTemplate">
    <div class="formula-tipology margin-topbottom-10">
        <div id="formula-macrotype-#=configurationIndex#" class="margin-10" data-role="dropdownlist" data-option-label="Seleziona Macrotipo"   data-text-field="macrotype" data-value-field="macrotype" data-bind="value: associatedTipologies[#=configurationIndex#].chosenMacrotype, source: availableTipologies.macrotypeCollection"></div>
        <div id="formula-type-one-#=configurationIndex#"  class="margin-10" data-role="dropdownlist" data-option-label="Seleziona Tipologia 1" data-text-field="tipology" data-value-field="tipology" data-bind="value: associatedTipologies[#=configurationIndex#].chosenTypeOne,   source: availableTipologies.typeoneCollection" data-cascade-from="formula-macrotype-#=configurationIndex#"></div>
        <div id="formula-type-two-#=configurationIndex#"  class="margin-10" data-role="dropdownlist" data-option-label="Seleziona Tipologia 2" data-text-field="subtype" data-value-field="subtype" data-bind="value: associatedTipologies[#=configurationIndex#].chosenTypeTwo,   source: availableTipologies.typetwoCollection" data-cascade-from="formula-type-one-#=configurationIndex#"></div>
        #if(data.showAddTipologyButton) { #
        <span class="k-icon k-i-add editor-plus-sign" title="Aggiungi tripletta" data-bind="click: addTipology"></span>
        # } #
    </div>
</script>


<script type="kendo/html" id="formulaSegmentTemplate">
    <span class="formulaSegment"> 
        # if(data.useDropDown) { #
        <div id="#='formula-'+ruleName#" data-bind="attr: {class: cssClass}" style="display:inline-block">
            <div style="width:100%" class="ruleOperatorDropDownlist" data-role="dropdownlist"  data-text-field="name" data-value-field="value" data-value-primitive="true" data-bind="value: selectedOption, source: logicalRuleOperators"></div> 
        </div>
        # } #
        <span class="rule-group-name">#=segmentName#</span>              
    </span>
</script>


<script type="kendo/html" id="ruleTemplate">
    <div id="#=ruleName#" class="rounded-border margin-10 padding-10">
        <a href='\\#' data-role='button' class='minimize-button' data-icon='minus' data-bind='click: toggleRule'></a>
        <div class="k-editor-header">
            <div>
                Regola #=ruleId#<input type="text" class="margin-10 rule-description k-textbox" placeholder="Descrizione" data-bind="value: ruleDescription"/>
                <a href="\\#" class="k-primary configurator-save-rule" data-icon="save" data-role="button" data-bind="click: saveRule, enabled: canSave()">Salva regola</a>
                <a href="\\#" class="configurator-add-rulegroup"  data-role="button" data-icon="add" data-bind="click: addRuleGroup">Aggiungi gruppo</a>                
            </div>
            
            <div class="margin-topbottom-10">
                Definizione Regola:<span class="rule-definition" data-bind="attr: { id: ruleDefId }"></span>
            </div>
        </div>
        <div class="k-editor-content"></div>
    </div> 
</script>




<script type="kendo/html" id="fieldGroupTemplate">
    <div class="editor-rule-group #=ruleName#">   
        <p class="margin-10 rule-group-name">Gruppo #=editorId#</p>        
        <div class="margin-10" data-bind="visible: showAddField">
            <div class="logicOperatorDropdownlist" data-role="dropdownlist" data-option-label="Seleziona opzione" data-text-field="name" data-value-field="value" data-value-primitive="true" data-bind="value: operator, source: operatorDataSource"></div> condizione.
        </div>
        <div class="editor-fields #=ruleName+' '+groupClass#"></div>
        <div class="margin-10">
            <a href="\\#" class="k-primary editor-save-button"  data-role="button" data-bind="click:saveFieldGroup, enabled: canSave('fieldGroup')">Salva</a>
        </div>
    </div>
</script>

<script type="kendo/html" id="ruleSegmentTemplate">
    <span class="ruleSegment"> 
        # if(data.useDropDown) { #
        <div id="#=ruleId+'-'+editorId #" data-bind="attr: {class: cssClass}" style="display:inline-block">
            <div style="width:100%" class="ruleOperatorDropDownlist" data-role="dropdownlist" data-dropdown-sequence="#=editorId#"  data-text-field="name" data-value-field="value" data-value-primitive="true" data-bind="value: selectedOption, source: logicalRuleOperators"></div> 
        </div>
        # } #
        <span class="rule-group-name">#=groupName#</span>              
    </span>
</script>


<script type="kendo/html" id="flowAssociationTemplate">
    <span class="#=value=='' ? 'k-state-disabled': ''#" title="#=title#">#=name#</span>
</script>

<script type="kendo/html" id="optionLabelTemplate">#=data#</script>

<script type="kendo/html" id="fieldTemplate">
    <div class="margin-10 editor-field">
        <div class="fieldSelectionDropdownlist" data-role="dropdownlist" data-option-label="Seleziona opzione" data-text-field="name" data-value-field="value" data-value-primitive="true" data-bind="value: #=fieldName#, source: fieldDataSource"></div> è valorizzato.
        #if(data.showAddFieldButton) { #
        <span class="k-icon k-i-add editor-plus-sign" title="Aggiungi campo obbligatorio" data-bind="click: addField"></span>
        # } #
    </div>
</script>



