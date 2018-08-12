

(function () {

    //variables and functions


    var configuration = {};



    var fieldNameValues = [
        { name: "Field 1", value: "field1" },
        { name: "Field 2", value: "field2" },
        { name: "Field 3", value: "field3" },
        { name: "Field 4", value: "field4" },
        { name: "Field 5", value: "field5" }
    ];

    var logicalFieldGroupOperators = [
        { name: "Ciascuna", value: "&" },
        { name: "Almeno una", value: "|" }
    ];

    var logicalRuleOperators = [
        { name: "E", value: "&" },
        { name: "Oppure", value: "|" }
    ];



    
    var saveRule = function(e) {
        var ruleName = e.sender.element.data().ruleName;
        var ruleSegment = $(".rule-definition[data-rule-name=" + ruleName + "] .ruleSegment");
        ruleSegment.each(function(i, segment) {
            var ddlist = $(segment).find("*[data-role=dropdownlist]");
            var operator = ddlist.length ? ddlist.eq(0).data("kendoDropDownList").value() : null;

            if(operator) {
                var editorElementId = $(segment).data().editor;
                configuration[ruleName][editorElementId]['prevRuleGroupRelationship'] = operator;
            }
        });
    }


    //save a rule group
    var saveRuleGroup = function (e) {
        e.sender.enable(false);
        var editorElementId = $(e.sender.element).data().editor;
        var ruleHolder = $(".editor-rule[data-editor=" + editorElementId + "]");
        var logicalConditionWidget = $("#" + editorElementId + " .k-widget .logicOperatorDropdownlist")
            .data("kendoDropDownList");
        var logicalCondition = logicalConditionWidget.value();
        var dropdowns = $("#" + editorElementId + " .k-widget .fieldSelectionDropdownlist");
        
        var ruleName = $("#" + editorElementId).data().ruleName;
        var ruleDescription = $(".rule-description[data-rule-name=" + ruleName + "]").val();

        //init rule node if undefined
        configuration[ruleName] = configuration[ruleName] ||
        {
            description: ruleDescription,
            logicOperatorSequence: new Array()
        };

        configuration[ruleName][editorElementId] = {
            operator: logicalCondition,
            fields: dropdowns.map(function (i, d) { return $(d).data("kendoDropDownList").value() }).toArray()
        }

        var operationType = ruleHolder.val().length ? "updated" : "created";
        ruleHolder.val(JSON.stringify(configuration[ruleName][editorElementId]));
        return operationType;

    };

    var fieldSelectionChangeFn = function(e) {
        var editorElementId = $(e.sender.element).data().editor;
        $("#" + editorElementId + " .editor-save-button").data("kendoButton").enable(true);
    }

    var initFieldSelectionDropdown = function () {
        var dropdowns = $(".editor-field > .fieldSelectionDropdownlist");
        //avoid reinitializing kendo widgets, just pick the one new div
        dropdowns.eq(dropdowns.length - 1).kendoDropDownList({
            dataSource: fieldNameValues,
            dataTextField: "name",
            dataValueField: "value",
            change: function (e) {
                var editorElementId = $(e.sender.element).data().editor;
                $("#" + editorElementId + " .editor-save-button").data("kendoButton").enable(true);
            }
        });
    }

    var initDropdowns = function (dropdowns, dataSource, changeFn) {
        //avoid reinitializing kendo widgets, just pick the one new div
        dropdowns.eq(dropdowns.length - 1).kendoDropDownList({
            dataSource: dataSource,
            dataTextField: "name",
            dataValueField: "value",
            change: changeFn
        });
    }

    var initNewFieldButton = function () {
        $(".editor-plus-sign").on("click",
            function (e) {
                var editorElementId = $(e.target).data().editor;
                var newFieldHtml = '<div class="editor-field">' +
                    '<div class="fieldSelectionDropdownlist" data-editor="' + editorElementId + '"></div> è valorizzato.' +
                    "</div>";

                $("#" + editorElementId + " .editor-save-button").parent().before(newFieldHtml);
                initFieldSelectionDropdown();
            }
        );
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
    }

    var initKendoButton = function (buttonId, onClickFn, icon) {
        $(buttonId).kendoButton({
            icon: icon,
            click: onClickFn
        });
    }

    //init in initConfigurator()
    var ruleGroupTemplate; 

    var handleNewRuleGroup = function (e, ruleId, newEditorId) {
        var data = {
            ruleId: ruleId,
            editorId: newEditorId
        }
        var initializedTemplate = ruleGroupTemplate(data);
        var ruleGroups = $(".editor-rule-group[data-rule-name=" + ruleId + "]");
        ruleGroups.eq(ruleGroups.length-1).after(initializedTemplate);

        initFieldSelectionDropdown();

        initDropdowns($(".editor-field > .logicOperatorDropdownlist"), logicalFieldGroupOperators, fieldSelectionChangeFn);
        //add new field to the rule
        initNewFieldButton();

        initKendoButton(".editor-save-button", handleSaveRuleGroup, "save");
    };

    var initNewRulegroupButton = function (ruleId) {
        var buttonElement = $(".configurator-add-rulegroup[data-rule-name=" + ruleId + "]");
        var lastEditorId = buttonElement.data().lastEditorId;
        buttonElement.kendoButton({
            icon: "add",
            click: function (e) {
                handleNewRuleGroup(e, ruleId, ++lastEditorId);
                buttonElement.data("lastEditorId", lastEditorId);
            }
        });
    }
    
    var initConfigurator = function () {

        //to-do: for each rule defined on db
        initNewRulegroupButton(1);

        initFieldSelectionDropdown();

        initDropdowns($(".logicOperatorDropdownlist"), logicalFieldGroupOperators, fieldSelectionChangeFn);
        //add new field to the rule
        initNewFieldButton();
        //buttons to save rule groups
        initKendoButton(".editor-save-button", handleSaveRuleGroup, "save");
        //button to save rule
        initKendoButton(".configurator-save-rule", saveRule, "save");
    }

    var initConfiguratorKendoTemplates = function() {
        ruleGroupTemplate = kendo.template($("#ruleGroupTemplate").html());
        ruleDefinitionTemplate = kendo.template($("#ruleDefinitionTemplate").html());
    }

    //on document ready
    $(function () {


        initConfigurator();
        initConfiguratorKendoTemplates();

    });
})();
