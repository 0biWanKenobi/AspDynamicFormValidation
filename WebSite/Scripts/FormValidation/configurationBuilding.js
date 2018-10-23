// ReSharper disable VariableUsedInInnerScopeBeforeDeclared
/**
 * @typedef {Object} observable
 * @method get
 * @method set 
 */

(function (window) {

    //variables and functions
    var kendo = window.kendo;

    window.FormConfigurator = {};
    var formConfigurator = window.FormConfigurator;

    var configuration = {
        formula: {
            id: null,
            name: null,
            description: null,
            isNew: null, // boolean true if formula has been persisted on db, false otherwise
            ruleCount: null
        },
        tipology: {
            macroType: null,
            typeOne:   null,
            typeTwo:   null
        },
        ruleNames: new Array()
    };
    formConfigurator.configuration = configuration;


    var configurationViewModels = {
        
        formula: {
            rules: {}
        }
    };
 
    /**
     * kendo templates (see ValidatorConfigurationTemplate.ascx)
     */
    var formulaTemplate, formulaSegmentTemplate, formulaTipologyTemplate, ruleTemplate, ruleSegmentTemplate, fieldGroupTemplate, fieldTemplate;


    /**
     * Values for dropdowns
     */
    var fieldNameValues = [
        { name: "Field 1", value: 1 },
        { name: "Field 2", value: 2 },
        { name: "Field 3", value: 3 },
        { name: "Field 4", value: 4 },
        { name: "Field 5", value: 5 }
    ];

    var logicalRuleOperators = [
        { name: "E", value: "&" },
        { name: "Oppure", value: "|" }
    ];

    var logicalFieldGroupOperators = [
        { name: "Ciascuna", value: "&" },
        { name: "Almeno una", value: "|" }
    ];

    var flowIdentificators = [
        {name:"Flusso GSE", value: "1", title: "[Flusso GSE, Tipologia 1, Sottotipo 1]"}
    ];

   
    

    /*
     *  GENERAL PURPOSE FUNCTIONS
     *
     */


    /** 
     * @param {function(observable)} onChangeCallback Callback on dropdown selected value change
     * @returns {observable} True false kendo dropdown ViewModel
     */
    var newLogicalOperatorViewModel = function(onChangeCallback) {
        var observable = kendo.observable({
            logicalRuleOperators: logicalRuleOperators,
            cssClass: function() {
                return ["&", ""].indexOf(this.get("selectedOption")) >= 0 ? "narrow" : "wide";
            },
            selectedOption: null
        });
        if (onChangeCallback)
            observable.bind("change",function() {
                onChangeCallback(observable);
            });
        return observable;
    };

    var submitJson = function(jsonString) {
        $.ajax({
            method: "POST",
            url: "/ValidatorConfiguration.aspx/SaveConfiguration",
            data: JSON.stringify({configuration: jsonString}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function() { alert("Configuration saved"); },
            error: function(jXhr, error, errorObj) {
                alert("Error of type " + error);
                console.log(errorObj);
            }
        });
    };
    
    /*
     *      FORMULA FUNCTIONS
     *
     */



    var injectFormulaTemplate = function() {
        var initFormulaTemplate = $(formulaTemplate({}));
        $("#formula-container").append(initFormulaTemplate);

        return initFormulaTemplate;
    };
    FormConfigurator.injectFormulaTemplate = injectFormulaTemplate;

    /**
     * Displays configurable formula information.
     * As side effects, defines the saveFormula function on the formula ViewModel, and saves formula properties
     * on the objects that is later used for JSON serialization to be sent to C# backend for saving on DB
     * @param {observable} formulaViewModel Formula kendo ViewModel
     * @param {object} initFormulaTemplate Initialised formula template
     * @returns {observable} Formula kendo ViewModel with additional properties set up
     */
    var loadFormula = function(formulaViewModel, initFormulaTemplate) {
       
        //var formulaViewModel = newFormulaViewModel(name, description, ruleCount, hasDefinition);
        kendo.bind(initFormulaTemplate, formulaViewModel);
        configurationViewModels.formula = formulaViewModel;

        configuration.formula.id = formulaViewModel.id;
        configuration.formula.name = formulaViewModel.name;
        configuration.formula.description = formulaViewModel.description;
        configuration.formula.ruleCount = formulaViewModel.ruleCount;
        configuration.formula.isNew = formulaViewModel.isNew();

        return formulaViewModel;
    };

    formConfigurator.loadFormula = loadFormula;

    var newFormula = function(formulaViewModel) {
        loadFormula(formulaViewModel, injectFormulaTemplate());
        

    };
    FormConfigurator.newFormula = newFormula;

    var saveFormula = function() {
        configuration.formula.ruleCount = configurationViewModels.formula.get("ruleCount");
        configuration.formula.description = configurationViewModels.formula.get("description");
        configuration.tipologies = configurationViewModels.formula.associatedTipologies;
        configuration.removedTipologies = configurationViewModels.formula.removedTipologies;

        var jsonString = $.trim(JSON.stringify(configuration));
        submitJson(jsonString);
    };
    FormConfigurator.saveFormula = saveFormula;


    var bindFormulaTipology = function(configurationIndex, isFirstTipology) {
        var initTemplate = formulaTipologyTemplate({
            showAddTipologyButton: isFirstTipology,
            configurationIndex: configurationIndex
        });
        $(".formula-tipologies").append(initTemplate);

        kendo.bind($(".formula-tipologies .formula-tipology").last(), configurationViewModels.formula);
    };
    FormConfigurator.bindFormulaTipology = bindFormulaTipology;

    


    /**
     * Add a segment to the formula definition. The segment is a rule name
     * @param {string} ruleName code name of the rule
     * @param {string} ruleHumanReadableName human readable rule name
     * @param {boolean} useDropDown the first segment must not show a logical operator
     * @returns {template} kendo HTML template for the rule segment
     */
    var newFormulaSegment = function(ruleName, ruleHumanReadableName, useDropDown) {
        return formulaSegmentTemplate({
            ruleName: ruleName,
            segmentName: ruleHumanReadableName,
            useDropDown: useDropDown
        });
    };

    var newFormulaOperatorViewModel = function(ruleName, prevRuleRelationship) {
        var callBackFunction = function(obs) {
            var ruleViewModel = configurationViewModels.formula.rules[ruleName].ruleViewModel;
            ruleViewModel.set("prevRuleGroupRelationship", obs.selectedOption);
        };

        var observable = newLogicalOperatorViewModel(callBackFunction);
        //show "and" operator as default if a new rule has just been created by the user
        observable.set("selectedOption", prevRuleRelationship || "&");
        
        return observable;
    };

    /**
     * Appends a formula definition segment to the DOM, and binds it to a dropdown template
     * if necessary
     * @param {string} ruleName rule name for DOM
     * @param {string} ruleHumanReadableName Rule name for the user
     * @param {string} prevRuleRelationship logic operator binding this rule to the previous one
     * @param {boolean} useDropDown true to show logic operator choice drodown
     */
    var bindRuleToFormulaDefinition = function(ruleName, ruleHumanReadableName, prevRuleRelationship, useDropDown) {
        var formulaDefinition = $(".configuration-formula-definition");
        
        var formulaSegment = $(newFormulaSegment(ruleName, ruleHumanReadableName, useDropDown));
        
        if(useDropDown) // if rule is not empty, init logical operator dropdown
            kendo.bind(formulaSegment, newFormulaOperatorViewModel(ruleName, prevRuleRelationship));
        formulaDefinition.append(formulaSegment);
    };

    var updateFormulaDefinition = function(ruleName, ruleHumanReadableName, prevRuleRelationship) {
        var formulaDefinition = $(".configuration-formula-definition");
        var segmentHasPredecessor = formulaDefinition.html().trim() !== "";
        bindRuleToFormulaDefinition(ruleName, ruleHumanReadableName, prevRuleRelationship, segmentHasPredecessor);
        configurationViewModels.formula.set("formulaHasDef", true);
    };
    FormConfigurator.bindRuleToFormulaDefinition = bindRuleToFormulaDefinition;


    /*
     *
     *
     *  RULE FUNCTIONS
     *
     *
     */


    /**
     * Create new kendo viewModel for a rule
     * @param {string} ruleName rule DOM and ViewModel name
     * @param {number} dbId rule identity on database
     * @param {number} ruleId rule progressive number
     * @param {string} prevRuleOperator and\or operator with respect to the previous rule in the formula expression
     * @param {string} ruleDescription human readable description
     * @returns {observable} kendo viewModel
     */
    var newRuleViewModel = function(ruleName, dbId, ruleId, prevRuleOperator, ruleDescription) {
        var ruleViewModel = kendo.observable({
            id: dbId,
            ruleId: ruleId,
            ruleName: ruleName,
            prevRuleOperator: prevRuleOperator,
            ruleHasDef: false,
            ruleIsDefInFormula: false,
            ruleDefId: ruleName + "-def",
            ruleDescription: ruleDescription,
            dirty: false,
            flowIdentificators: flowIdentificators,
            removedFieldGroupIds: new Array(),
            change: function(e){
                switch(e.field){
                    case "ruleDescription": this.set("dirty", this.get("ruleDescription").length > 0); break;
                    case "dirty": break;
                    default: this.set("dirty", true);
                }               
            },
            canSave: canSaveRule,
            removeFieldGroup: function(fieldGroup) {
                // need to add group name to fieldgroup div container, eg editor-rule-group rule1 group1
                var fieldGroupElement = $(".editor-rule-group." + fieldGroup.ruleName + ".group"+fieldGroup.editorId);
                var ruleSegment = $("#" + fieldGroup.ruleName + "-editor-" + fieldGroup.editorId).parent();
                ruleSegment.remove();
                fieldGroupElement.remove();
                var fieldGroupId = fieldGroup.get("dbId");
                if (fieldGroupId)
                    removedFieldGroupIds.push(fieldGroupId);
                this.set("dirty", true);
            },
            updateRuleDefinition: updateRuleDefinition,
            groupCount: 0, //TO-DO has to be 0 in prod
            updateRuleName: function() {
                this.set("dirty", true);
            },
            saveRule: function() {
                saveRule(this.ruleName);
                configurationViewModels.formula.set("pristine", false);
                this.set("dirty", false);
                //update formula definition only if it does not yet contain this rule
                if(!this.get("ruleIsDefInFormula")) {
                    updateFormulaDefinition(this.ruleName, "Regola " + this.ruleId, this.prevRuleOperator);
                    this.set("ruleIsDefInFormula", true);
                }
            },
            toggleRule: function() {
                $("#" + ruleName).hasClass("minimized")
                    ? $("#" + ruleName).removeClass("minimized") && $("#" + ruleName+" .minimize-button .k-icon").attr("class", "k-icon k-i-minus")
                    : $("#" + ruleName).addClass("minimized") && $("#" + ruleName+" .minimize-button .k-icon").attr("class", "k-icon k-i-add");
            },
            addFieldGroup: function(e, fieldGroupDbId) {
                if (e) //invoked by user action, so there is an event object "e".
                    // At this point formula obj exists in configurationViewModels
                {
                    var fieldGroupDataModel = addFieldGroupToRule(this, null);
                    fieldGroupDataModel.addField();
                    configurationViewModels.formula.rules[ruleName].fieldGroupViewModels["editor"+fieldGroupDataModel.editorId]=fieldGroupDataModel;
                }
                else
                    // fieldGroupDataModel is added later in configurationLoading.js
                    return addFieldGroupToRule(this, fieldGroupDbId);
// ReSharper disable once NotAllPathsReturnValue
            }
        });
        return ruleViewModel;
    };
    
    /**
     * Append rule template to DOM and bind a viewModel to it
     * @param {string} prevRuleOperator previous rule logic operator
     * @param {string} ruleDescription rule human readable description
     * @param {string} ruleName rule DOM and ViewModel name
     * @param {number} ruleId rule id
     * @param {number} ruleDbId rule id on database (null for new rules)
     * @returns {observable} New rule DataModel
     */
    var loadConfigurationRule = function(prevRuleOperator, ruleDescription, ruleName, ruleId, ruleDbId) {

        var initTemplate = ruleTemplate({
            ruleName: ruleName,
            ruleId:   ruleId
        });

        $("#formula-rules ").append(initTemplate);
        
        // ReSharper disable once VariableUsedInInnerScopeBeforeDeclared
        var ruleViewModel = newRuleViewModel(ruleName, ruleDbId, ruleId, prevRuleOperator, ruleDescription);
        kendo.bind($("#formula-rules #"+ruleName), ruleViewModel);
        return ruleViewModel;
    };
    FormConfigurator.loadConfigurationRule = loadConfigurationRule;

    /**
     * Kendo template for a part of rule definition (eg. "and group4")
     * @param {number} ruleId id of the rule this segment belongs to
     * @param {number} editorId id of the DOM element this template will become
     * @param {string} groupName name of the group of fields this segment represents
     * @param {boolean} useDropDown true if a dropdown for the logical operator must be visible
     *                              (false for the first segment of the rule def.)
     * @returns {object} kendo template for a rule segment
     */
    var newRuleSegment = function(ruleId, editorId, groupName, useDropDown) {
        var data = {
            editorId: editorId,
            ruleId: ruleId,
            groupName: groupName,
            useDropDown: useDropDown
        };
        return ruleSegmentTemplate(data);
    };

    /**
     * And/or dropdown kendo ViewModel for a rule segment.
     * Also defines a callback that updates the logical operator in the fieldGroup ViewModel     *
     * when the dropdown value is changed by the user
     *
     * @param {object} fieldGroupViewModel ViewModel of a set of form fields. 
     * @returns {observable} a new kendo ViewModel 
     */
    var newRuleOperatorViewModel = function (fieldGroupViewModel) {

        var callBackFunction = function(obs) {
            fieldGroupViewModel.set("prevRuleGroupRelationship", obs.selectedOption);
        };

        var observable = newLogicalOperatorViewModel(callBackFunction);
        observable.set("selectedOption", fieldGroupViewModel.prevRuleGroupRelationship || "&");
        
        return observable;
    };

    /**
     * Updates the rule definition in the DOM, adding a new rule segment
     * @param {observable} fieldGroupDataModel kendo DataModel for the group of fields
     *                                         represented by this segment
     */
    var updateRuleDefinition = function (fieldGroupDataModel) {
        var editorName = "editor-" + fieldGroupDataModel.editorId;
        var groupName = "Gruppo " +  fieldGroupDataModel.editorId;

        var ruleDefinition = $("#"+this.ruleDefId);
        var ruleDefinitionHasValue = ruleDefinition.html().length > 0;
        var ruleSegment = $(newRuleSegment(fieldGroupDataModel.ruleName, editorName, groupName, ruleDefinitionHasValue));

        if (ruleDefinitionHasValue) // if rule is not empty, init logical operator dropdown
            kendo.bind(ruleSegment, newRuleOperatorViewModel(fieldGroupDataModel));//ruleName, "editor"+editorId, prevRuleGroupRelationship));
        ruleDefinition.append(ruleSegment);
        this.set("ruleHasDef", true);
    };

    /**
     * Checks if the rule can be saved or not.
     * The rule must have a description, a definition and at least one of its fields
     * must have been changed by the user
     * @returns {boolean} True if the rule can be saved
     */
    var canSaveRule = function() {
        var canSave = this.get("dirty") && this.get("ruleHasDef") && this.get("ruleDescription");
        //configurationViewModels.formula.set("dirty_" + this.ruleName, canSave);
        return canSave;
    };

    /**
     * Saves the rule to a lean js object, stripping unnecessary attributes.
     * This object can then be turned into JSON and sent to the server side
     * @param {string} ruleName name of this rule
     */
    var saveRule = function(ruleName) {
        var rule = configurationViewModels.formula.rules[ruleName];
        
        configuration[ruleName] = {
            id: rule.ruleViewModel.get("id"),
            name: ruleName,
            formula: configurationViewModels.formula.get("name"), 
            rulegroups: new Array(),
            description: rule.ruleViewModel.ruleDescription,
            removedFieldGroupIds: rule.ruleViewModel.removedFieldGroupIds
        };

        for(
            var i = 1;
            i<=rule.ruleViewModel.groupCount;
            i++
        ){
            var fieldGroupViewModel = rule.fieldGroupViewModels.get("editor"+i);
            var editorElementId = "editor-" + fieldGroupViewModel.editorId;
            configuration[ruleName]["rulegroups"].push(editorElementId);

            configuration[ruleName][editorElementId] = {
                id: fieldGroupViewModel.dbId,
                fieldNames: fieldGroupViewModel.fieldNames,
                operator: fieldGroupViewModel.operator,
                prevRuleGroupRelationship: fieldGroupViewModel.prevRuleGroupRelationship,
                prevFieldGroupId: fieldGroupViewModel.prevFieldGroupId,
                removedFieldIds: fieldGroupViewModel.removedFieldIds
            };
            fieldGroupViewModel.fieldNames.forEach(function(field) {
                configuration[ruleName][editorElementId][field] = fieldGroupViewModel[field];
            });
        };        
       
        if (configuration.ruleNames.indexOf(ruleName) < 0)
            configuration.ruleNames.push(ruleName);
    };


    /**
     * Appends a field group to the DOM, and binds it to the a template
     * @param {observable} viewModel rule kendo ViewModel
     * @returns {observable} the fieldgroup viewModel
     */
    var addFieldGroupToRule = function (viewModel, fieldGroupDbId) {
        viewModel.set("groupCount", viewModel.get("groupCount") + 1);
        var data = {
            editorId: viewModel.get("groupCount"),
            groupClass: "group"+viewModel.get("groupCount"),
            ruleName: viewModel.get("ruleName"),
            fieldName: "field1"
        };
        var initializedTemplate = $(fieldGroupTemplate(data));
        var ruleGroups = $(".editor-rule-group." + data.ruleName);
        if (ruleGroups.length > 0)
            ruleGroups.last().after(initializedTemplate);
        else {
            var rule = $("#" + viewModel.get("ruleName") + " .k-editor-content");
            rule.append(initializedTemplate);
        }

        var fieldGroupViewModel = newFieldGroupViewModel(viewModel, data.ruleName, data.editorId, fieldGroupDbId, data.groupClass);
        kendo.bind(initializedTemplate, fieldGroupViewModel);
        return fieldGroupViewModel;
    };

    
    /*
     * 
     *      FIELD FUNCTIONS
     *
     */


    /**
     * Add new dropdown in the DOM to a field group     * 
     * @param {boolean} showAddFieldButton Load the new field button as part of the template if true
     * @param {observable} viewModel The field group viewModel
     *
     * @returns {string} Name of the new field
     */
    var addFieldToGroup = function(showAddFieldButton, fieldToGroupAssociationId, viewModel) {
        var fieldNames = viewModel.get("fieldNames");
        var newFieldName = "field" + (fieldNames.length + 1);
        fieldNames.push(newFieldName);
        viewModel[newFieldName] = null;
       
        var newFieldHtml = $(fieldTemplate({
            fieldName: newFieldName,
            showAddFieldButton: showAddFieldButton,
            fieldToGroupAssociationId: fieldToGroupAssociationId
        }));

        $(".editor-fields."+viewModel.ruleName+"."+viewModel.groupClass).append(newFieldHtml);
        kendo.bind(newFieldHtml, viewModel);
        return newFieldName;
    };

    
    /**
     * Checks if the fieldGroup can be saved.
     * Used to enable\disable the save button for the field group.
     * @returns {boolean} field group can be saved if each field has a value
     * and the logical operator is set
     */
    var canSaveFieldGroup = function() {
        var canSave = true;
        var that = this;
        $(this.get("fieldNames")).each(function(i, fieldName) {
            canSave = canSave && !!that.get(fieldName);
        });
        return canSave && (!!this.get("operator") || this.get("fieldCount") === 1) && this.get("dirty");
    };

    var FieldGroupDataModel = kendo.data.Model.define({

        id: "editorId",
        fieldDataSource: fieldNameValues,
        operatorDataSource: logicalFieldGroupOperators,
        fields: {
            "pristine":                  {defaultValue: null},
            "rule":                      {defaultValue: null},
            "rulename":                  {type: "string"},
            "editorId":                  {type: "number"},
            "dbId":                      {type: "number"},
            "operator":                  {type: "string"},
            "prevRuleGroupRelationship": {type: "string"},
            "prevFieldGroupId":          {type: "number"},
            "field1":                    {type: "string"},
            "fieldCount":                {type: "number"},
            "fieldNames":                {defaultValue: null},
            "removedFieldIds":           {defaultValue: new Array()}
        },
           
        canSave: canSaveFieldGroup,
        showAddField: function() {
            return this.get("fieldCount") > 1;
        },
        addFieldFromConfig: function(fieldToGroupAssociationId) {
            var newFieldName = addFieldToGroup(this.get("fieldCount") === 0, fieldToGroupAssociationId, this);
            this.set("fieldCount", this.get("fieldCount")+1);
            return newFieldName;
        },
        addField: function(e) {
            addFieldToGroup(this.get("fieldCount") === 0, null, this);
            this.set("fieldCount", this.get("fieldCount")+1);
        },
        removeField: function(e) {
            $(e.target).parent().remove();
            var fieldName = $(e.target).data("fieldName");
            var removedFieldNamePos = this.fieldNames.indexOf(fieldName);
            this.fieldNames.splice(removedFieldNamePos, 1);
            var fieldGroupAssociationId = $(e.target).data("fieldGroupAssociationId");
            if(fieldGroupAssociationId != null)
                this.removedFieldIds.push(fieldGroupAssociationId);

            this.set("fieldCount", this.get("fieldCount")-1);
        },
        saveFieldGroup: function() {
            this.saveFieldGroupFromConfig();
            this.rule.set("dirty", true);
        },
        removeFieldGroup: function() {
            this.rule.removeFieldGroup(this);
        },
        saveFieldGroupFromConfig() {
            if (this.get("pristine")) {
                this.rule.updateRuleDefinition(this);//this.get("editorId"), this.get("ruleName"), this.get("prevRuleGroupRelationship"));
                this.set("pristine", false);
            }
            this.set("dirty",false);
        }
    });

     function newFieldGroupViewModel(ruleViewModel, ruleName, editorId, dbId, groupClass) {
         var fgDataModel = new FieldGroupDataModel({
             pristine: true,
             rule: ruleViewModel,
             ruleName: ruleName,
             editorId: editorId,
             dbId: dbId,
             groupClass: groupClass,
             fieldNames: new Array(),
             removedFieldIds: new Array(),
            fieldCount: 0,
            prevRuleGroupRelationship: null
        });
        return fgDataModel;
    };
    
    /*
     *
     *      INITIALIZATION FUNCTIONS
     *
     */

    
    /**
     * Initializes all kendo templates.
     * To look at their html, see ValidatorConfigurationTemplate.ascx
     */
    var initConfiguratorKendoTemplates = function() {
        fieldTemplate = kendo.template($("#fieldTemplate").html());
        fieldGroupTemplate = kendo.template($("#fieldGroupTemplate").html());
        ruleTemplate = kendo.template($("#ruleTemplate").html());
        ruleSegmentTemplate = kendo.template($("#ruleSegmentTemplate").html());
        formulaSegmentTemplate = kendo.template($("#formulaSegmentTemplate").html());
        formulaTipologyTemplate = kendo.template($("#formulaTipologyTemplate").html());
        formulaTemplate = kendo.template($("#formulaTemplate").html());
    };

    //on document ready
    $(function () {

        initConfiguratorKendoTemplates();
        //initConfigurator();
        

    });
})(window);
