<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="jsLiveBuilder.ascx.cs" Inherits="WebSite.JsLiveBuilder" %>
<script type="text/javascript">

    var isFilled = function (input) {
        var element = $('#' + input);
        if (!element.length) return false;
        return $('#'+input).val().length > 0;
    }
  
    var getColor = function (result){
        return result ? 'black' : 'red';
    }
    
    var colorizeLabel = function (label, result){
        $(label).css('color', getColor(result));
    }


    <%  
        foreach (var r in RuleDefinitions)
        { %>
    var rule<%=r.Id%> = function() {
        var valResult =  <%= r.Definition     %>;
        validationResults.results.push(
            {
                result: valResult,
                elements: [<%= r.RuleFields%>]
            });
        return valResult;   
    };
    <%  } %>


    var validationFormula = function() {
        return <%= RuleDefinitions?.FirstOrDefault()?.Formula %>;
    }

    var validationResults = {
        results: new Array()
    };
  
    
    var runValidation = function(){
        console.log('Initiating validation..');
        var validationSuccess = validationFormula();
        if(validationSuccess)
            console.log('validation success!');
        else	
            console.log('validation failed!');
    
        for(var resultIndex in validationResults.results) {
            if (validationResults.results.hasOwnProperty(resultIndex)) {
                var result = (validationResults.results[resultIndex]);
                for (var elIndex in result.elements)
                    if (result.elements.hasOwnProperty(elIndex))
                        colorizeLabel('label[for=' + result.elements[elIndex] + ']', validationSuccess);
            }
        }

    }
    
    $(function(){
    
        runValidation();
        $('#register').on(
            'click', 
            function(e){
                e.preventDefault();
                if (validationResults && validationResults.results.length)
                    validationResults.results = new Array();
                runValidation();
            });
  	
    });
    </script>