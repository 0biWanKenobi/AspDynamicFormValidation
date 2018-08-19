<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="jsLiveBuilder.ascx.cs" Inherits="WebSite.JsLiveBuilder" %>
<script type = "text/javascript">

    (function() {


        var xmlConfiguration = $.parseXML("<%= XmlConfiguration %>");

        var validationResults = {
            results: new Array()
        };

        var isFilled = function(input) {
            var element = $('#' + input);
            if (!element.length) return false;
            return $('#' + input).val().length > 0;
        };

        var getColor = function(result) {
            return result ? 'black' : 'red';
        };

        var colorizeLabel = function(label, result) {
            $(label).css('color', getColor(result));
        };

        var isEachFieldValid = function(fieldGroup) {
            var isValid = true;
            $("Fields Field", fieldGroup).each(function(i, field) {
                var fieldName = "field" + $(field).attr("Id");
                var checkResult = isFilled(fieldName);
                isValid = isValid && checkResult;
                validationResults.results.push({ element: fieldName, valid: checkResult });
            });
            return isValid;
        };

        var isAnyFieldValid = function(fieldGroup) {
            var isValid = false;
            $("Fields Field", fieldGroup).each(function(i, field) {
                var fieldName = "field" + $(field).attr("Id");
                var checkResult = isFilled(fieldName);
                isValid = isValid || checkResult;
                validationResults.results.push({ element: fieldName, valid: checkResult });
            });
            return isValid;
        };

        var isAnd = function(operator) {
            return operator === "&amp;";
        };

        var isOr = function(operator) {
            return operator === "|";
        }


        var validateForm = function() {

            var isFormulaValid = true;
            $("Formula", xmlConfiguration).each(function(i, formula) {

                var rules = $("Rule", formula);

                isFormulaValid = null;

                rules.each(function(j, rule) {
                    
                    var isRuleValid = null; 
                    var fieldGroups = $("FieldGroups FieldGroup", rule);

                    var prevRuleOperator = $("PrevRuleOperator", rule);

                    fieldGroups.each(function(i, fieldGroup) {
                        var groupOperator = $("Operator", fieldGroup).html();
                        var prevGroupOperator = $("PrevGroupOperator", fieldGroup).html();
                        var isGroupValid = isAnd(groupOperator)
                            ? isEachFieldValid(fieldGroup)
                            : isAnyFieldValid(fieldGroup);

                        if (isRuleValid === null) {
                            isRuleValid = isGroupValid;
                            return;
                        }

                        if (isAnd(prevGroupOperator))
                            isRuleValid = isRuleValid && isGroupValid;
                        else if (isOr(prevGroupOperator))
                            isRuleValid = isRuleValid || isGroupValid;
                    });

                    if (isFormulaValid === null) {
                        isFormulaValid = isRuleValid;
                        return;
                    }

                    isAnd(prevRuleOperator)
                        ? isFormulaValid = isRuleValid && isFormulaValid
                        : isFormulaValid = isRuleValid || isFormulaValid;
                });
            });
            return isFormulaValid;
        };


        


        var runValidation = function() {
            console.log('Initiating validation..');
            var validationSuccess = validateForm();
            if (validationSuccess) {
                console.log('validation success!');
                $(validationResults.results).each(function(i, field) {
                    colorizeLabel('label[for=' + field.element + ']', true);
                });
                return;
            }
            else
                console.log('validation failed!');


            $(validationResults.results).each(function(i, field) {
                colorizeLabel('label[for=' + field.element + ']', field.valid);
            });

            

        };

        $(function() {
            runValidation();
            validateForm();
            $('#register').on(
                'click',
                function(e) {
                    e.preventDefault();
                    if (validationResults && validationResults.results.length)
                        validationResults.results = new Array();
                    runValidation();
                });

        });

    })();


</script>