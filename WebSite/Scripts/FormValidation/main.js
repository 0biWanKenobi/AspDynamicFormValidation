(function (window) {

    //variables and functions
    var kendo = window.kendo;

    var configuration = {
        ruleNames: new Array()
    };

    var configurationViewModels = {
        rules: {}
    };

    var fieldTemplate;

    var fieldNameValues = [
        { name: "Field 1", value: "field1" },
        { name: "Field 2", value: "field2" },
        { name: "Field 3", value: "field3" },
        { name: "Field 4", value: "field4" },
        { name: "Field 5", value: "field5" }
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

    var addFieldToGroup = function(e) {
        var fieldNames = this.get("fieldNames");
        var newFieldName = "field" + (fieldNames.length + 1);
        fieldNames.push(newFieldName);
        this[newFieldName] = null;


        var editorElementId = $(e.target).data().editor;
        var newFieldHtml = fieldTemplate({
            editorId: editorElementId,
            fieldName: newFieldName
        });

        var saveButton = $("#" + editorElementId + " .editor-save-button").parent().before(newFieldHtml);
        kendo.bind(saveButton.siblings().last(), this);

    };

    //init in initConfigurator()
    var ruleDefinitionTemplate;

    var newRuleSegment = function(ruleId, editorId, groupName, useDropDown) {
        
        var data = {
            editorId: editorId,
            ruleId: ruleId,
            groupName: groupName,
            useDropDown: useDropDown
        };
        return ruleDefinitionTemplate(data);
    };

    var newRuleOperatorViewModel = function(ruleName, fieldGroupName) {
        var observable =  kendo.observable({
            logicalRuleOperators: logicalRuleOperators,
            cssClass: function() {
                return ["&", ""].indexOf(this.get("selectedOption")) >= 0 ? "narrow" : "wide";
            },
            selectedOption: "&"
        });

        observable.bind("change",
            function(e) {
                var fieldGroupViewModel = configurationViewModels.rules[ruleName].fieldGroupViewModels[fieldGroupName];
                fieldGroupViewModel.set("prevRuleGroupRelationship", observable.selectedOption);
            }
        );

        return observable;
    };

    // field group can be saved if each field has a value
    // and the logical operator is set
    var canSaveFieldGroup = function() {
        var canSave = true;
        var that = this;
        $(this.get("fieldNames")).each(function(i, fieldName) {
            canSave = canSave && !!that.get(fieldName);
        });
        return canSave && (!!this.get("operator") || this.get("fieldNames").length === 1) && this.get("dirty");
    };

    var FieldGroupDataModel = kendo.data.Model.define({

        id: "editorId",
        fieldDataSource: fieldNameValues,
        operatorDataSource: logicalFieldGroupOperators,
        fieldNames: ["field1"],
        fields: {
            "pristine":                  {defaultValue: null},
            "rule":                      {defaultValue: null},
            "rulename":                  {type: "string"},
            "editorId":                  {type: "number"},
            "operator":                  {type: "string"},
            "prevRuleGroupRelationship": {type: "string"},
            "field1":                    {type: "string"}
        },
           
        canSave: canSaveFieldGroup,
        addField: addFieldToGroup,
        saveFieldGroup: function() {
            if (this.get("pristine")) {
                this.rule.updateRuleDefinition(this.get("editorId"), this.get("ruleName"));
                this.set("pristine", false);
            }
            this.set("dirty",false);
        }
    });

    var newFieldGroupViewModel = function(ruleViewModel, ruleName, editorId) {
        var fgDataModel =  new FieldGroupDataModel({
            pristine: true,
            rule: ruleViewModel,
            ruleName: ruleName,
            editorId: editorId,
            fieldNames: ["field1"],
            prevRuleGroupRelationship: null
        });

        configurationViewModels.rules[ruleName].fieldGroupViewModels["editor"+editorId]=fgDataModel;
        return fgDataModel;
    };

    var ruleGroupTemplate; 

    var addGroupToRule = function () {
        this.set("groupCount", this.get("groupCount") + 1);
        var data = {
            editorId: this.get("groupCount"),
            ruleId: this.get("ruleName"),
            fieldName: "field1"
        };
        var initializedTemplate = $(ruleGroupTemplate(data));
        var ruleGroups = $(".editor-rule-group[data-rule-name=" + data.ruleId + "]");
        ruleGroups.last().after(initializedTemplate);

        kendo.bind(initializedTemplate, newFieldGroupViewModel(this, data.ruleId, data.editorId));

    };


    var updateRuleDefinition = function(editorId, ruleName) {
        var editorName = "editor-" + editorId;
        var groupName = "Gruppo " +  editorId;

        var ruleDefinition = $("#"+this.ruleDefId);
        var ruleDefinitionHasValue = ruleDefinition.html().length > 0;
        var ruleSegment = $(newRuleSegment(ruleName, editorName, groupName, ruleDefinitionHasValue));
        
        if(ruleDefinitionHasValue) // if rule is not empty, init logical operator dropdown
            kendo.bind(ruleSegment, newRuleOperatorViewModel(ruleName, "editor"+editorId));
        ruleDefinition.append(ruleSegment);
        this.set("ruleHasDef", true);
    };

    // rule can be saved if it has a definition
    var canSaveRule = function() {
        return this.get("ruleHasDef") && this.get("associatedFlow") && this.get("ruleDescription");
    };

    var newRuleViewModel = function(ruleName) {
        var ruleViewModel = kendo.observable({
            canSave: canSaveRule,
            ruleName: ruleName,
            ruleHasDef: false,
            ruleDefId: ruleName+"-def",
            ruleDescription: null,
            associatedFlow: null,
            flowIdentificators: flowIdentificators,
            updateRuleDefinition: updateRuleDefinition,
            groupCount: 1, //TO-DO has to be 0 in prod
            addRuleGroup: addGroupToRule
        });

        configurationViewModels.rules[ruleName]={
            ruleViewModel: ruleViewModel,
            fieldGroupViewModels: {}
        };

        return ruleViewModel;
    };

    var initViewModels = function() {
        $("#configuratorForm > div").each(function(i, rule) {
            var ruleViewModel = newRuleViewModel("rule" + (i + 1));
            kendo.bind($(rule).find(".k-editor-header"), ruleViewModel);

            $(rule).find(".editor-rule-group").each(function(j, fieldGroup) {
                kendo.bind(fieldGroup, newFieldGroupViewModel(ruleViewModel, "rule" + (i + 1), j + 1));
            });
        });
    };
    
    
    var submitRuleJson = function(jsonString) {
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

    var saveRule = function(e) {

        var ruleName = e.sender.element.data().ruleName;
        var rule = configurationViewModels.rules[ruleName];
        
        configuration[ruleName] = {
            rulegroups: new Array(),
            description: rule.ruleViewModel.ruleDescription,
            flowId: rule.ruleViewModel.associatedFlow.value
        };

        $.each(rule.fieldGroupViewModels, function(i, fieldGroupViewModel) {
            var editorElementId = "editor-" + fieldGroupViewModel.editorId;
            configuration[ruleName]["rulegroups"].push(editorElementId);

            configuration[ruleName][editorElementId] = {
                fieldNames: fieldGroupViewModel.fieldNames,
                prevRuleGroupRelationship: fieldGroupViewModel.prevRuleGroupRelationship
            };
            fieldGroupViewModel.fieldNames.forEach(function(f) {
                configuration[ruleName][editorElementId][f] = fieldGroupViewModel[f];
            });
        });        
       
        if (configuration.ruleNames.indexOf(ruleName) < 0)
            configuration.ruleNames.push(ruleName);

        var jsonString = $.trim(JSON.stringify(configuration));
        submitRuleJson(jsonString);
    };

    var initKendoButton = function(buttonId, onClickFn, icon) {
        return $(buttonId).not("[data-role='button']").kendoButton({
            icon: icon,
            click: onClickFn
        }).data("kendoButton");
    };

    //init in initConfigurator()


    var initConfigurator = function() {
        initViewModels();
        initKendoButton(".configurator-save-rule", saveRule, "save");
    };


    var initConfiguratorKendoTemplates = function() {
        fieldTemplate = kendo.template($("#fieldTemplate").html());
        ruleGroupTemplate = kendo.template($("#ruleGroupTemplate").html());
        ruleDefinitionTemplate = kendo.template($("#ruleDefinitionTemplate").html());
    };

    //on document ready
    $(function () {

        initConfiguratorKendoTemplates();
        initConfigurator();
        

    });
})(window);
