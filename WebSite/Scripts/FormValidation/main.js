

(function () {

    //variables and functions


    var configuration = {
        ruleNames: new Array()
    };



    var fieldNameValues = [
        { name: "Field 1", value: "field1" },
        { name: "Field 2", value: "field2" },
        { name: "Field 3", value: "field3" },
        { name: "Field 4", value: "field4" },
        { name: "Field 5", value: "field5" }
    ];

    var flowIdentificators = [
        {name:"Flusso GSE", value: "1", title: "[Flusso GSE, Tipologia 1, Sottotipo 1]"}
    ];

    var flowRuleAssociationTemplate;

    var logicalFieldGroupOperators = [
        { name: "Ciascuna", value: "&" },
        { name: "Almeno una", value: "|" }
    ];

    var logicalRuleOperators = [
        { name: "E", value: "&" },
        { name: "Oppure", value: "|" }
    ];


    var isElementEnabled = function(configurationOption, ruleId) {
        switch (configurationOption) {
            case 'savingRule' :
                return !!$(".rule-definition[data-rule-name=" + ruleId + "]").html().length;
            default:
                return false;
        }
    }


    var enabledViewModel = { savingRule: false };
    var setBindings = function() {

        enabledViewModel = kendo.observable({
            savingRule: false,
            savingRuleGroup: false,
            isEnabled: function(infoString) {
                var info = infoString.split('|');
                this.set(info[0], isElementEnabled(info[0], info[1]));
                return this.get(info[0]); /*isEnabled(elementName);*/
            }
        });

        kendo.bind($(".configurator-save-rule"), enabledViewModel);
    }

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
        var ruleName =                          e.sender.element.data().ruleName;
        var ruleDescription =                   $(".rule-description[data-rule-name=" + ruleName + "]").val();
        var ruleSegment =                       $(".rule-definition[data-rule-name=" + ruleName + "] .ruleSegment");
        
        
        configuration[ruleName]["rulegroups"] = new Array();

        ruleSegment.each(function(i, segment) {
            var ddlist = $(segment).find("*[data-role=dropdownlist]");
            var operator = ddlist.length ? ddlist.eq(0).data("kendoDropDownList").value() : null;
            var editorElementId = $(segment).data().editor;

            configuration[ruleName]["rulegroups"].push(editorElementId);
            if(operator) {                
                configuration[ruleName][editorElementId]["prevRuleGroupRelationship"] = operator;
            }
        });

        configuration.ruleNames.push(ruleName);
        configuration[ruleName]["description"] = ruleDescription;
        configuration[ruleName]["flowId"] =
            $('.flow-association[data-rule-name=' + ruleName + ']').data('kendoDropDownList').value();

        var jsonString = $.trim(JSON.stringify(configuration));
        $(".rule-json[data-rule-name="+ruleName+"]").val(jsonString);

        submitRuleJson(jsonString);
    }

    

    //save a rule group
    var saveRuleGroup = function (e) {
        e.sender.enable(false);
        var editorElementId =           $(e.sender.element).data().editor;
        var ruleHolder =                $(".editor-rule[data-editor=" + editorElementId + "]");
        var logicalConditionWidget =    $("#" + editorElementId + " .k-widget .logicOperatorDropdownlist").data("kendoDropDownList");
        var logicalCondition =          logicalConditionWidget.value();
        var fieldWidgets =              $("#" + editorElementId + " .k-widget .fieldSelectionDropdownlist");
        
        var ruleName =                  $("#" + editorElementId).data().ruleName;
        

        //init rule node if undefined
        configuration[ruleName] = configuration[ruleName] || {};

        configuration[ruleName][editorElementId] = {
            operator: logicalCondition,
            fields: fieldWidgets.map(function (i, d) { return $(d).data("kendoDropDownList").value() }).toArray()
        }

        var operationType = ruleHolder.val().length ? "updated" : "created";
        ruleHolder.val(JSON.stringify(configuration[ruleName][editorElementId]));
        return operationType;

    };

    var fieldSelectionChangeFn = function(e) {
        var editorElementId = $(e.sender.element).data().editor;
        $("#" + editorElementId + " .editor-save-button").data("kendoButton").enable(true);
    }


    var initDropdowns = function (dropdowns, dataSource, changeFn, template) {
        //avoid reinitializing kendo widgets, just pick the one new div
        dropdowns.not('.k-widget').kendoDropDownList({
            dataSource: dataSource,
            dataTextField: "name",
            dataValueField: "value",
            change: changeFn,
            select: function(e){
                if(e.dataItem.value === ""){
                    e.preventDefault();
                }
            },
            template: template,
            valueTemplate: template,
            optionLabelTemplate: template,
            optionLabel: {name: "Seleziona opzione..", value:"",  title:"Click per selezionare"}
        });
    }

    var initNewFieldButton = function () {
        //avoid attaching an event handler to buttons that have one already.
        var buttons = $(".editor-plus-sign").not('[data-role="button"]');
        buttons.on("click",
            function (e) {
                var editorElementId = $(e.target).data().editor;
                var newFieldHtml = '<div class="editor-field">' +
                    '<div class="fieldSelectionDropdownlist" data-editor="' + editorElementId + '"></div> è valorizzato.' +
                    "</div>";

                $("#" + editorElementId + " .editor-save-button").parent().before(newFieldHtml);
                initDropdowns($(".editor-field > .fieldSelectionDropdownlist"), fieldNameValues, fieldSelectionChangeFn);
            }
        );
        buttons.attr("data-role", "button");
    }


    //init in initConfigurator()
    var ruleDefinitionTemplate;

    var updateRuleDefinition = function (ruleId, editorId, groupName) {
        var ruleDefinition = $(".rule-definition[data-rule-name=" + ruleId + "]");
        var data = {
            editorId: editorId,
            groupName: groupName,
            dropDownClass: ruleDefinition.html().length ? "ruleOperatorDropDownlist and" : "no-display"
    }
        var initializedTemplate = ruleDefinitionTemplate(data);
        ruleDefinition.append(initializedTemplate);
    }

    var ruleOperatorChange = function(e) {
        if (e.sender.value() === "&") {
            e.sender.wrapper.removeClass("or").addClass("and");
            e.sender.element.removeClass("or").addClass("and");
        }
        else {
            e.sender.wrapper.removeClass("and").addClass("or");
            e.sender.element.removeClass("and").addClass("or");
        }
    }

    var handleSaveRuleGroup = function(e) {
        var operationType = saveRuleGroup(e);
        if (operationType === "created") {
            var button = $(e.sender.element);
            var groupName = $(".rule-group-name[data-editor=" + button.data().editor + "]").html();
            updateRuleDefinition(button.data().ruleName, button.data().editor, groupName);
            initDropdowns($(".ruleSegment > .ruleOperatorDropDownlist"), logicalRuleOperators, ruleOperatorChange);
        }
        enabledViewModel.set('savingRule', true);
    }

    var initKendoButton = function (buttonId, onClickFn, icon) {
        return $(buttonId).not("[data-role='button']").kendoButton({
            icon: icon,
            click: onClickFn
        }).data('kendoButton');
    }

    //init in initConfigurator()
    var ruleGroupTemplate; 

    var initNewRuleGroup = function (e, ruleId, newEditorId) {
        var data = {
            ruleId: ruleId,
            editorId: newEditorId
        }
        var initializedTemplate = ruleGroupTemplate(data);
        var ruleGroups = $(".editor-rule-group[data-rule-name=" + ruleId + "]");
        ruleGroups.last().after(initializedTemplate);

        initDropdowns($(".editor-field > .fieldSelectionDropdownlist"), fieldNameValues, fieldSelectionChangeFn);

        initDropdowns($(".editor-field > .logicOperatorDropdownlist"), logicalFieldGroupOperators, fieldSelectionChangeFn);
        //add new field to the rule ( this is not a kendo button )
        initNewFieldButton();
        //start disabled
        initKendoButton(".editor-save-button", handleSaveRuleGroup, "save").enable(false);
    };

    var initNewRuleGroupButton = function (ruleId) {
        var buttonElement = $(".configurator-add-rulegroup[data-rule-name=" + ruleId + "]");
        var lastEditorId = buttonElement.data().lastEditorId;
        var buttonElementOnClick = function (e) {
            initNewRuleGroup(e, ruleId, ++lastEditorId);
            buttonElement.data("lastEditorId", lastEditorId);
        }
        initKendoButton(buttonElement, buttonElementOnClick, "add");
        
    }
    
    var initConfigurator = function () {

        //to-do: for each rule defined on db
        initNewRuleGroupButton("rule-1");
        //field selection for rulegroups
        initDropdowns($(".editor-field > .fieldSelectionDropdownlist"), fieldNameValues, fieldSelectionChangeFn);
        // and/or selectors for rulegroups and rule definition
        initDropdowns($(".logicOperatorDropdownlist"), logicalFieldGroupOperators, fieldSelectionChangeFn);
        // selector for rule->dataflow association

        initDropdowns($(".flow-association"), flowIdentificators, null, flowRuleAssociationTemplate);

        //add new field to the rule
        initNewFieldButton();
        //buttons to save rule groups
        initKendoButton(".editor-save-button", handleSaveRuleGroup, "save").enable(false);
        //button to save rule
        initKendoButton(".configurator-save-rule", saveRule, "save");

        setBindings();
    }

    
    var initConfiguratorKendoTemplates = function() {
        ruleGroupTemplate = kendo.template($("#ruleGroupTemplate").html());
        ruleDefinitionTemplate = kendo.template($("#ruleDefinitionTemplate").html());
        flowRuleAssociationTemplate = kendo.template($("#flowAssociationTemplate").html());
    }

    //on document ready
    $(function () {

        initConfiguratorKendoTemplates();
        initConfigurator();
        

    });
})();
