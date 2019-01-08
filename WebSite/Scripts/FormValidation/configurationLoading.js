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

        var fieldGroupViewModel = ruleViewModel.addFieldGroup(null, $(fieldGroup).attr("Id"));
        fieldGroupViewModel.set("operator", getLogicOperator(groupOperator));
        fieldGroupViewModel.set("prevFieldGroupId", $("PrevGroup", fieldGroup));

        $("Fields Field", fieldGroup).each(function(j, field) {
            //pass id of field<->fieldgroup association
            var newFieldName = fieldGroupViewModel.addFieldFromConfig($("FieldId", field).html());
            fieldGroupViewModel.set(newFieldName, parseInt($(field).attr("Id")));
        });

        fieldGroupViewModel.set("prevRuleGroupRelationship", getLogicOperator(prevGroupOperator));
        fieldGroupViewModel.saveFieldGroupFromConfig();

        return fieldGroupViewModel;
    };

    var loadRuleConfiguration = function(rule, ruleCount) {
        var ruleViewModel = formConfigurator.loadConfigurationRule($("PrevRuleOperator", rule), $("Description", rule).html(), $(rule).attr("Name"), $(rule).attr("Id"), $(rule).attr("Id"));
        //set value here to avoid having it as true for rules added by the user 
        ruleViewModel.set("ruleIsDefInFormula", true);
        formConfigurator.bindRuleToFormulaDefinition(
            $(rule).attr("Name").replace(/[\s,-]/g, ''),
            "Regola " + ruleCount,
            $("PrevRuleOperator", rule).html() || null
        );

        var fieldGroupViewModels = {};

        var fieldGroups = $("FieldGroups FieldGroup", rule);
        fieldGroups.each(function(i, fieldGroup) {
            var fieldGroupViewModel = loadFieldGroupConfiguration(fieldGroup, ruleViewModel);
            fieldGroupViewModels["editor" + (i + 1)] = fieldGroupViewModel;
        });

        ruleViewModel.bind("change", function(e) { ruleViewModel.change(e) });

        return {
            ruleViewModel: ruleViewModel,
            fieldGroupViewModels: fieldGroupViewModels
        };
    };


    var bindFormulaTipology = function(configurationIndex, isFirstTipology) {
        FormConfigurator.bindFormulaTipology(configurationIndex, isFirstTipology);
    };


    var loadFormulaTipologyConfiguration = function(tipologies, availableTipologies) {

        var associatedTipologies = new Array();

        tipologies.each(function(i, tipology) {
            var availableTipologiesLength = availableTipologies.length;
            availableTipologies.push({
                macrotypeCollection: newMacroTypeDataSource(),
                typeoneCollection: newTipologyDataSource(),
                typetwoCollection: newSubtypeDataSource(function() {
                    if (configurationLoaderViewModel.formula != null)
                        return configurationLoaderViewModel.formula.get("associatedTipologies")[availableTipologiesLength].chosenMacrotype;
                    return null;
                })
            });
            bindFormulaTipology(associatedTipologies.length, associatedTipologies.length === 0);
            associatedTipologies.push({
                chosenTipologyId: $(tipology).attr("Id") ,
                chosenMacrotype:  $(tipology).attr("Macrotype"),
                chosenTypeOne:    $(tipology).attr("TypeOne"),
                chosenTypeTwo:    $(tipology).attr("TypeTwo")
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

        rules.each(function(i, rule) {
            var ruleAndFieldGroups = loadRuleConfiguration(rule, i+1);
            var ruleName = ruleAndFieldGroups.ruleViewModel.get("ruleName");
            ruleViewModels[ruleName] = ruleAndFieldGroups;
            ruleNames.push(ruleName);
            ruleDirtyStatuses[ruleName] = false;
        });

        var availableTipologies = new Array();
        var associatedTipologies = loadFormulaTipologyConfiguration(tipologies, availableTipologies);

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
                associatedTipologies: associatedTipologies,
                removedTipologies: new Array(),
                availableTipologies: availableTipologies
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
     *  TIPOLOGY DROPDOWN INITIALIZERS
     *
     */


    var newMacroTypeDataSource = function() {
        return new kendo.data.DataSource({
            transport: {
                read: function(e) {
                    var callBack = function(data) {
                        console.log("Macrotypes loaded");
                        return e.success(JSON.parse(data.d).macrotypes);
                    };
                    var errorCallBack = function(jXhr, error, errorObj) {
                        alert("Error of type " + errorObj + "while loading macrotypes");
                    };
                    callAjax("LoadMacrotypes", null, callBack, errorCallBack);
                }
            }
            , sort: {field: "value",dir: "asc"}
        });
    };

    var newTipologyDataSource = function() {
        return new kendo.data.DataSource({
            transport: {
                read: function(e) {
                    var callBack = function(data) {
                        console.log("Tipologies loaded");
                        return e.success(JSON.parse(data.d).tipologies);
                    };
                    var errorCallBack = function(jXhr, error, errorObj) {
                        alert("Error of type " + errorObj + "while loading tipologies");
                    };
                    callAjax("LoadTipologies",
                        "{filters: " + JSON.stringify([
                            {
                                field: "tipology",
                                operator: "eq",
                                value: e.data.filter.filters[0].value
                            }]) + "}",
                        callBack,
                        errorCallBack);
                }
            },
            serverFiltering: true,
            sort: {field: "value",dir: "asc"}
        });
    };

    var newSubtypeDataSource = function(fetchFilterFn) {
        return new kendo.data.DataSource({
            transport: {
                read: function(e) {
                    var callBack = function(data) {
                        console.log("Subtypes loaded");
                        return e.success(JSON.parse(data.d).subtypes);
                    };
                    var errorCallBack = function(jXhr, error, errorObj) {
                        alert("Error of type " + errorObj + "while loading subtypes");
                    };
                   
                    callAjax("LoadSubtypes",
                        "{filters: " + JSON.stringify([
                            {
                                field: "tipology",
                                operator: "eq",
                                value: e.data.filter.filters[0].value
                            },
                            {
                                field: "macrotype",
                                operator: "eq",
                                value: fetchFilterFn() || null
                            }]) + "}",
                        callBack,
                        errorCallBack);
                }
            },
            serverFiltering: true, 
            sort: {field: "value",dir: "asc"}
        });
    };

    var initializeFlowDropDowns = function() {
        kendo.bind("#configurationLoaderForm", configurationLoaderViewModel);
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
            description: { type: "string", defaultValue: null },
            formulaHasDef: { type: "boolean", defaultValue: false },

            availableTipologies: {
                defaultValue: [{
                    macrotypeCollection: newMacroTypeDataSource(),
                    typeoneCollection: newTipologyDataSource(),
                    typetwoCollection: newSubtypeDataSource(function () {return configurationLoaderViewModel.formula.get("associatedTipologies")[0].chosenMacrotype})
                }]
            },
            associatedTipologies: { defaultValue: new Array() },
            removedTipologies: {defaultValue: new Array() },
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

            var availableTipologiesLength = this.availableTipologies.length;
            this.availableTipologies.push({
                macrotypeCollection: newMacroTypeDataSource(),
                typeoneCollection: newTipologyDataSource(),
                typetwoCollection: newSubtypeDataSource(function() {
                    if (configurationLoaderViewModel.formula != null)
                        return configurationLoaderViewModel.formula.get("associatedTipologies")[availableTipologiesLength].chosenMacrotype;
                    return null;
                })
            });

            bindFormulaTipology(this.associatedTipologies.length, this.associatedTipologies.length === 0);
            this.associatedTipologies.push({
                chosenTipologyId: null,
                chosenMacrotype:  null,
                chosenTypeOne:    null,
                chosenTypeTwo:    null
            });
        },
        removeTipology: function(e) {
            var associatedTipologyId = $(e.currentTarget).data("id");
            var tipology = $(e.currentTarget).parent();
            kendo.unbind(tipology);
            var removedTipology = this.associatedTipologies.splice(associatedTipologyId, 1)[0];
            this.removedTipologies.push(removedTipology.chosenTipologyId);
            tipology.remove();

        },
        newRule: function() {
            this.set("ruleCount", this.get("ruleCount") + 1);
            var ruleName = "rule" + this.get("ruleCount");
            var ruleViewModel = FormConfigurator.loadConfigurationRule(
                null,
                "",
                ruleName,
                this.get("ruleCount"),
                null
            );
            this.set("rules." + ruleName, {
                ruleViewModel: ruleViewModel,
                fieldGroupViewModels: {}
            });
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

    var fetchFilter = function() {
        return configurationLoaderViewModel.get("tipology").chosenMacrotype.macrotype;
    };
    
    configurationLoaderViewModel = kendo.observable({

        formula: null,

        tipology: kendo.observable({
            chosenMacrotype: null,
            chosenTypeOne: null,
            chosenTypeTwo: null
        }),
        availableTipologies: [{
            //configurationLoaderViewModel.tipology.chosenMacrotype.macrotype
            macrotypeDatasource: newMacroTypeDataSource(),
            tipologyDatasource: newTipologyDataSource(),
            subtypeDatasource: newSubtypeDataSource(function() {
                return configurationLoaderViewModel.get("tipology").chosenMacrotype;
            })
        }],    
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
        newFormula: function () {
            this.set("formula", new FormulaDataModel());
            formConfigurator.newFormula(this.formula);
        }
    });


    

    


    /*
     *  DOCUMENT READY HOOK
     *
     */

    $(function() {
        initializeFlowDropDowns();
        //loadFlowList("{}");
    });

})(window, window.FormConfigurator);