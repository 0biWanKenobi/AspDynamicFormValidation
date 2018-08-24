(function(window, formConfigurator) {

    var kendo = window.kendo;

  
    var configurationLoaderViewModel = {};
// ReSharper disable once JoinDeclarationAndInitializerJs
    var FormulaDataModel;

    /*
     *  GENERAL PURPOSE FUNCTIONS
     *
     */


    var callAjax = function(webMethod, data, callBack, errorCallBack) {
        $.ajax({
            method: "POST",
            url: "/ValidatorConfiguration.aspx/" + webMethod,
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: callBack,
            error: errorCallBack
        });
    };

    var getLogicOperator = function(xmlOperator) {
        return xmlOperator === "&amp;" ? "&" : xmlOperator === "|" ? "|" : null;
    };

    /*
     *  CONFIGURATION XML PARSING AND LOADING FUNCTIONS
     *
     */


    var loadFieldGroupConfiguration = function(fieldGroup, ruleViewModel) {
        var groupOperator = $("Operator", fieldGroup).html();
        var prevGroupOperator = $("PrevGroupOperator", fieldGroup).html();

        var fieldGroupViewModel = ruleViewModel.addRuleGroup();
        fieldGroupViewModel.set("operator", getLogicOperator(groupOperator));

        $("Fields Field", fieldGroup).each(function(j, field) {
            var newFieldName = fieldGroupViewModel.addFieldFromConfig();
            fieldGroupViewModel.set(newFieldName, parseInt($(field).attr("Id")));
        });

        fieldGroupViewModel.set("prevRuleGroupRelationship", getLogicOperator(prevGroupOperator));
        fieldGroupViewModel.saveFieldGroupFromConfig();

        return fieldGroupViewModel;
    };

    var loadRuleConfiguration = function(rule, ruleCount) {
        var ruleViewModel = formConfigurator.loadConfigurationRule($("PrevRuleOperator", rule), $("Description", rule).html(), $(rule).attr("Name"), $(rule).attr("Id"), $(rule).attr("Id"));


        formConfigurator.bindRuleToFormulaDefinition(
            $(rule).attr("Name"),
            "Regola " + ruleCount,
            $("PrevRuleOperator", rule).html() || null
        );

        var fieldGroupViewModels = {};

        var fieldGroups = $("FieldGroups FieldGroup", rule);
        fieldGroups.each(function(i, fieldGroup) {
            var fieldGroupViewModel = loadFieldGroupConfiguration(fieldGroup, ruleViewModel);
            fieldGroupViewModels["editor" + (i + 1)] = fieldGroupViewModel;
        });

        return {
            ruleViewModel: ruleViewModel,
            fieldGroupViewModels: fieldGroupViewModels
        };
    };


    var bindFormulaTipology = function(configurationIndex, isFirstTipology) {
        FormConfigurator.bindFormulaTipology(configurationIndex, isFirstTipology);
    };


    var loadFormulaTipologyConfiguration = function(tipologies) {

        var associatedTipologies = new Array();

        tipologies.each(function(i, tipology) {
            bindFormulaTipology(associatedTipologies.length, associatedTipologies.length === 0);
            associatedTipologies.push({
                chosenMacrotype: {name:$(tipology).attr("Macrotype"), value:$(tipology).attr("Id")},
                chosenTypeOne:   {name: $(tipology).attr("TypeOne"),  value:$(tipology).attr("Id")},
                chosenTypeTwo:   {name:$(tipology).attr("TypeTwo"),   value:$(tipology).attr("Id")}
            });
           
        });

        return associatedTipologies;
    };
    
    var loadConfiguration = function(xmlConfigurationString) {

        $("#configuratorForm div").empty();

        var xmlConfiguration = $.parseXML(xmlConfigurationString);
        var formula = $("Formula", xmlConfiguration);
        var rules = $("Rule", xmlConfiguration);
        var tipologies = $("Tipologies Tipology", xmlConfiguration);

        var ruleViewModels = {};
        var ruleNames = new Array();
        var ruleDirtyStatuses = {};

        var formulaKendoTemplate = FormConfigurator.injectFormulaTemplate();

        $("Rule", xmlConfiguration).each(function(i, rule) {
            var ruleAndFieldGroups = loadRuleConfiguration(rule, i+1);
            var ruleName = ruleAndFieldGroups.ruleViewModel.get("ruleName");
            ruleViewModels[ruleName] = ruleAndFieldGroups;
            ruleNames.push(ruleName);
            ruleDirtyStatuses[ruleName] = false;
        });

       

        var formulaViewModel = formConfigurator.loadFormula(
            new FormulaDataModel({
                id: $(formula).attr("Id"),
                name: "formula" + $(formula).attr("Id"),
                saveEnabled: false,
                pristine: true,
                description: $("Description", formula).html(),
                ruleCount: $(rules).length,
                ruleNames: ruleNames,
                ruleDirtyStatuses: ruleDirtyStatuses,
                rules: ruleViewModels,
                ruleHasDef: $(rules).length > 0,
                associatedTipologies: loadFormulaTipologyConfiguration(tipologies),
                availableTipologies: configurationLoaderViewModel.availableTipologies
            }),
            formulaKendoTemplate
        );
        return formulaViewModel;
    };


    
    
   

    /*
     * JSON REQUEST
     *
     */

    var requestConfiguration = function(data) {
        var callBack = function(data) {
            var xmlData = JSON.parse(data.d).configuration;
            configurationLoaderViewModel.formula = loadConfiguration(xmlData);
            configurationLoaderViewModel.formula.set("dirty", false);
            configurationLoaderViewModel.formula.bind("change",
                function(e) {
                    if(e.field==="saveEnabled") return;
                    this.set("saveEnabled", this.canSave());
                });


            console.log("Configuration loaded");
        };
        var errorCallBack = function(jXhr, error, errorObj) {
            alert("Error of type " + errorObj + "while loading configuration");
        };
        callAjax("LoadConfiguration", data, callBack, errorCallBack);
    };


    /*
     *  CONFIGURATION VIEWMODEL CONSTRUCTORS
     *
     */


    FormulaDataModel = kendo.data.Model.define({

        id: "id",
        fields: {
            id: { type: "number", defaultValue: null },
            name: { type: "string", defaultValue: "formula1" },
            pristine: { type: "boolean", defaultValue: true },
            saveEnabled: { type: "boolean", defaultValue: false },
            description: { type: "string" },
            formulaHasDef: { type: "boolean", defaultValue: false },

            availableTipologies: {
                defaultValue: {
                    macrotypeCollection: new Array(),
                    typeoneCollection: new Array(),
                    typetwoCollection: new Array()
                }
            },
            associatedTipologies: { defaultValue: new Array() },
            rules: { defaultValue: {} },
            ruleDirtyStatuses: { defaultValue: {} },
            ruleCount: { type: "number", defaultValue: 0 },
            ruleNames: new Array()
        },


        saveFormula: function() {
            FormConfigurator.saveFormula();
        },

        canSave: function() {
            var canSave =
                this.get("dirty") ||
                this.get("pristine") === false &&
                this.get("description") !== null &&
                this.get("associatedTipologies").length > 0 &&
                this.get("formulaHasDef");

            if (!canSave) return false;

            $(this.associatedTipologies).each(function(i, tipology) {
                canSave = tipology.chosenMacrotype !== null && canSave;
            });


            var that = this;
            $(this.get("ruleNames")).each(function(i, ruleName) {
                canSave = !that.get("ruleDirtyStatuses." + ruleName) && canSave;
            });
            // Enable saving if a rule has changed, or formula info (description, tipologies) have changed
            return canSave;
        },
        addTipology: function() {

            bindFormulaTipology(this.associatedTipologies.length, this.associatedTipologies.length === 0);
            this.associatedTipologies.push({
                chosenMacrotype: {name: null, value: null},
                chosenTypeOne:   {name: null, value: null},
                chosenTypeTwo:   {name: null, value: null}
            });
        },
        newRule: function() {
            this.set("ruleCount", this.get("ruleCount") + 1);
            var ruleName = "rule" + this.get("ruleCount");
            FormConfigurator.loadConfigurationRule(
                null,
                "",
                ruleName,
                this.get("ruleCount"),
                null
            );
            this.ruleDirtyStatuses[ruleName] = false;
            this.set("ruleDirtyStatuses." + ruleName, false);
        },
        getTipology: function() {
            return {
                macroType: this.chosenMacrotype,
                typeOne: this.chosenTypeOne,
                typeTwo: this.chosenTypeTwo
            };
        }
    });

    
    configurationLoaderViewModel = kendo.observable({

        formula: null,

        tipology: kendo.observable({
            chosenMacrotype: null,
            chosenTypeOne:   null,
            chosenTypeTwo:   null
        }),

        availableTipologies: {
            macrotypeCollection: null,
            typeoneCollection: null,
            typetwoCollection: null
        },                      

        isLoaded:false,
        isConfigurationLoaded: function() {
            return this.get("isLoaded");
        },
        canLoad: function () {
            var tipology = this.get("tipology");
            return tipology.get("chosenMacrotype") !== null;
        },


        saveButtonTitle: function() {
            return this.get("tipology").chosenMacrotype !== null ? "" : "Seleziona almeno il macrotipo";
        },

        loadConfiguration: function() {
            var json = "{tipology: " +
                JSON.stringify({
                    macroType: this.tipology.chosenMacrotype,
                    typeOne:   this.tipology.chosenTypeOne,
                    typeTwo:   this.tipology.chosenTypeTwo
                }) +
                "}";
            requestConfiguration(json);
            this.set("isConfigurationLoaded", true);
        },

        newFormula: function() {
            formConfigurator.newFormula(this.formula);
        }
    });


    /*
     *  TIPOLOGY DROPDOWN INITIALIZERS
     *
     */

    var initializeFlowDropDowns = function(flowList) {

        var macrotypeCollection = new Array();
        var typeOneCollection =   new Array();
        var typeTwoCollection =   new Array();

        $(flowList).each(function(i, flow) {
            macrotypeCollection.push({ "valueM": flow.MacroType,  "name": flow.MacroType });
            typeOneCollection.push({   "valueT1": flow.TypeOne,   "name": flow.TypeOne, "valueM":  flow.MacroType });
            typeTwoCollection.push({   "valueT2": flow.TypeTwo,   "name": flow.TypeTwo, "valueT1": flow.TypeOne });
        });

        configurationLoaderViewModel.set("availableTipologies.macrotypeCollection", macrotypeCollection);
        configurationLoaderViewModel.set("availableTipologies.typeoneCollection"  , typeOneCollection  );
        configurationLoaderViewModel.set("availableTipologies.typetwoCollection"  , typeTwoCollection  );

        kendo.bind("#configurationLoaderForm", configurationLoaderViewModel);

        
    };

    var loadFlowList = function() {
        //var jsonString = JSON.stringify({ parameters: jsonData });
        var callBack = function(data) {
            initializeFlowDropDowns(JSON.parse(data.d).tipologies);
            console.log("Flows list loaded");
        };
        var errorCallBack = function(jXhr, error, errorObj) {
            alert("Error of type " + errorObj + "while loading flow list");
        };
        callAjax("LoadFlowList", null, callBack, errorCallBack);
    };

    /*
     *  DOCUMENT READY HOOK
     *
     */

    $(function() {
        loadFlowList("{}");
    });

})(window, window.FormConfigurator);